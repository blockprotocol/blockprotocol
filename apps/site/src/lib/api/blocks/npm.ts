import os from "node:os";
import path from "node:path";

import { execa } from "execa";
import fs from "fs-extra";
import { globby } from "globby";
import { Db } from "mongodb";
import tar from "tar";
import tmp from "tmp-promise";

import { ExpandedBlockMetadata } from "../../blocks";
import { getDbBlock, insertDbBlock, updateDbBlock } from "./db";
import { validateExpandAndUploadBlockFiles } from "./s3";

/**
 * Unpacks and uploads an npm package to remote storage
 * @param createdAt if this block was created previously, an ISO string of when it was created, otherwise null
 * @param npmPackageName the name of the npm package to mirror
 * @param pathWithNamespace the block's unique path in the format '@[namespace]/[path]', e.g. '@hash/code'
 */
const mirrorNpmPackageToS3 = async ({
  createdAt,
  npmPackageName,
  pathWithNamespace,
}: {
  createdAt: string | null;
  npmPackageName: string;
  pathWithNamespace: string;
}): Promise<{
  expandedMetadata: ExpandedBlockMetadata;
}> => {
  const { path: npmTarballFolder, cleanup: cleanupDistFolder } = await tmp.dir({
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
    npmPackArgs.push("--cache", path.resolve(os.tmpdir(), ".npm_cache"));
    ({ stdout: tarballFilename } = await execa(
      "npm",
      npmPackArgs,
      execaOptions,
    ));

    // we use a library because tar is not installed in Vercel lambdas
    await tar.x({
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
    createdAt,
    localFolderPath: blockSourceFolder,
    npmPackageName,
    pathWithNamespace,
  });

  void cleanupDistFolder();

  return {
    expandedMetadata,
  };
};

/**
 * Publishes a block which is already published as an npm package
 * @param db a database client
 * @param params.createdAt if this block was created previously, an ISO string of when it was created, otherwise null
 * @param params.pathWithNamespace the block's unique path in the format '@[namespace]/[path]', e.g. '@hash/code'
 * @param params.npmPackageName the name of the npm package the block is published as
 */
export const publishBlockFromNpm = async (
  db: Db,
  params: {
    createdAt: string | null;
    npmPackageName: string;
    pathWithNamespace: string;
  },
) => {
  const { createdAt, pathWithNamespace, npmPackageName } = params;

  const blockLinkedToPackage = await getDbBlock({ npmPackageName });

  if (blockLinkedToPackage) {
    throw new Error(
      `npm package '${npmPackageName}' is already linked to block '${blockLinkedToPackage.pathWithNamespace}'`,
      {
        cause: { code: "NPM_PACKAGE_TAKEN" },
      },
    );
  }

  const { expandedMetadata } = await mirrorNpmPackageToS3({
    createdAt,
    npmPackageName,
    pathWithNamespace,
  });

  await (createdAt
    ? updateDbBlock(expandedMetadata)
    : insertDbBlock(expandedMetadata));

  return expandedMetadata;
};
