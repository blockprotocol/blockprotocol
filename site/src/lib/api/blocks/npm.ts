import execa from "execa";
import fs from "fs-extra";
import { globby } from "globby";
import { Db } from "mongodb";
import path from "node:path";
import tar from "tar";
import tmp from "tmp-promise";

import { ExpandedBlockMetadata } from "../../blocks";
import { isProduction } from "../../config";
import { User } from "../model/user.model";
import { getDbBlock, insertDbBlock } from "./db";
import { validateExpandAndUploadBlockFiles } from "./r2";
import { isRunningOnVercel } from "./shared";

/**
 * Unpacks and uploads an npm package to remote storage
 * @param npmPackageName the name of the npm package to mirror
 * @param pathWithNamespace the block's unique path in the format '@[namespace]/[path]', e.g. '@hash/code'
 */
const mirrorNpmPackageToR2 = async (
  npmPackageName: string,
  pathWithNamespace: string,
): Promise<{
  expandedMetadata: ExpandedBlockMetadata;
}> => {
  const { path: npmTarballFolder, cleanup: cleanupDistFolder } = await tmp.dir({
    tmpdir: isRunningOnVercel ? "/tmp" : undefined, // Vercel allows limited file system access
    unsafeCleanup: true,
  });

  const execaOptions = { cwd: npmTarballFolder };

  // download and unpack the package from npm
  let tarballFilename;
  try {
    const npmPackArgs = [
      "pack",
      npmPackageName,
      "--pack-destination",
      npmTarballFolder,
    ];
    if (isRunningOnVercel) {
      npmPackArgs.push("--cache", "/tmp/.npm");
    }
    ({ stdout: tarballFilename } = await execa(
      "npm",
      npmPackArgs,
      execaOptions,
    ));

    await tar.x({
      // tar is not available on deployed lambdas
      cwd: npmTarballFolder,
      file: path.resolve(npmTarballFolder, tarballFilename),
    });
  } catch (err) {
    throw new Error(
      `Could not find package '${npmPackageName}'. Does it exist?`,
      { cause: { code: "PACKAGE_NOT_FOUND" } },
    );
  }

  const packageFolder = path.resolve(npmTarballFolder, "package");

  // Find the block's source folder by locating the block-metadata.json
  const metadataJsonPath = (
    await globby("**/block-metadata.json", {
      absolute: true,
      cwd: packageFolder,
      caseSensitiveMatch: false,
    })
  )[0];
  if (!metadataJsonPath) {
    throw new Error("No block-metadata.json present in package", {
      cause: { code: "INVALID_PACKAGE_CONTENTS" },
    });
  }

  const blockSourceFolder = path.resolve(
    packageFolder,
    path.dirname(metadataJsonPath),
  );

  // move the readme into the block's source folder, if it exists
  const readmePath = (
    await globby("README.md", {
      absolute: true,
      cwd: packageFolder,
      caseSensitiveMatch: false,
    })
  )[0];
  if (readmePath) {
    fs.renameSync(
      path.resolve(packageFolder, readmePath),
      path.resolve(blockSourceFolder, path.basename(readmePath)),
    );
  }

  const { expandedMetadata } = await validateExpandAndUploadBlockFiles({
    createdAt: null,
    localFolderPath: blockSourceFolder,
    npmPackageName,
    pathWithNamespace,
  });

  void cleanupDistFolder();

  return {
    expandedMetadata,
  };
};

export const publishBlockFromNpm = async (
  db: Db,
  params: { name: string; npmPackageName: string; user: User },
) => {
  const { name, npmPackageName, user } = params;
  const shortname = user.shortname;
  if (!shortname) {
    throw new Error("User must have completed signup to publish a block");
  }

  const pathWithNamespace = `@${shortname}/${name}`;

  const [blockWithName, blockLinkedToPackage] = await Promise.all([
    getDbBlock({ name, author: shortname }),
    getDbBlock({ npmPackageName }),
  ]);
  if (blockWithName) {
    throw new Error(`Block name '${pathWithNamespace}' already exists`, {
      cause: { code: "NAME_TAKEN" },
    });
  }
  if (isProduction && blockLinkedToPackage) {
    throw new Error(
      `npm package '${npmPackageName}' is already linked to block '${blockLinkedToPackage.pathWithNamespace}'`,
      {
        cause: { code: "NPM_PACKAGE_TAKEN" },
      },
    );
  }

  const { expandedMetadata } = await mirrorNpmPackageToR2(
    npmPackageName,
    pathWithNamespace,
  );

  await insertDbBlock(expandedMetadata);

  return expandedMetadata;
};
