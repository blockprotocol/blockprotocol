import { BlockMetadata, BlockMetadataRepository } from "@blockprotocol/core";
import execa from "execa";
import fs from "fs-extra";
import glob from "glob";
import { Db } from "mongodb";
import child_process from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import slugify from "slugify";
import tar from "tar";
import tmp from "tmp-promise";

import { expandBlockMetadata, ExpandedBlockMetadata } from "../../blocks";
import { User } from "../model/user.model";
import { getDbBlock, insertDbBlock } from "./db";
import { publicBaseR2Url, uploadBlockFilesToR2, wipeR2BlockFolder } from "./r2";

const stripLeadingAt = (pathWithNamespace: string) =>
  pathWithNamespace.replace(/^@/, "");

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
  const isRunningOnVercel = !!process.env.VERCEL;

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
      // tar is not availabled on deployed lambdas
      cwd: npmTarballFolder,
      file: path.resolve(npmTarballFolder, tarballFilename),
    });
  } catch (err) {
    throw new Error(
      `Could not find package '${npmPackageName}'. Does it exist?`,
      { cause: { code: "PACKAGE_NOT_FOUND" } },
    );
  }

  // check the package contents and retrieve useful metadata
  const packageFolder = path.resolve(npmTarballFolder, "package");

  // get the package.json - we know this exists and is valid JSON, since it's an npm-published package
  const packageJsonString = fs
    .readFileSync(path.resolve(packageFolder, "package.json"))
    .toString();
  const packageJson = JSON.parse(packageJsonString);

  // get the block-metadata.json
  const metadataJsonPath = glob.sync("**/block-metadata.json", {
    cwd: packageFolder,
    nocase: true,
  })[0];
  if (!metadataJsonPath) {
    throw new Error("No block-metadata.json present in package", {
      cause: { code: "INVALID_PACKAGE_CONTENTS" },
    });
  }

  let metadataJson;
  try {
    const metadataJsonString = fs
      .readFileSync(path.resolve(packageFolder, metadataJsonPath))
      .toString();
    metadataJson = JSON.parse(metadataJsonString);
  } catch (err) {
    throw new Error(
      `Could not parse block-metadata.json: ${(err as Error).message}`,
      {
        cause: { code: "INVALID_PACKAGE_CONTENTS" },
      },
    );
  }

  const blockSourceFolder = path.resolve(
    packageFolder,
    path.dirname(metadataJsonPath),
  );

  // move the readme into the block's source folder, if it exists
  const readmePath = glob.sync("README.md", {
    cwd: packageFolder,
    nocase: true,
  })[0];
  if (readmePath) {
    fs.renameSync(
      path.resolve(packageFolder, readmePath),
      path.resolve(blockSourceFolder, path.basename(readmePath)),
    );
  }

  // check if we have 'example-graph.json', which we then construct a URL for in the extended matadata
  const includesExampleGraph = await fs.pathExists(
    path.resolve(blockSourceFolder, "example-graph.json"),
  );

  // check block-metadata.json contains required properties
  for (const key of ["blockType", "protocol", "schema", "source", "version"]) {
    if (!metadataJson[key]) {
      throw new Error(`block-metadata.json must contain a '${key}' property`, {
        cause: { code: "INVALID_PACKAGE_CONTENTS" },
      });
    }
  }

  // check that the source file actually exists
  const sourcePath = metadataJson.source;
  const sourceFileExists = await fs.pathExists(
    path.resolve(blockSourceFolder, sourcePath),
  );

  if (!sourceFileExists) {
    throw new Error(
      `block-metadata.json 'source' path '${sourcePath}' does not exist`,
      {
        cause: { code: "INVALID_PACKAGE_CONTENTS" },
      },
    );
  }

  // check that the schema actually exists
  const schemaPath = metadataJson.schema;
  if (schemaPath.startsWith("http")) {
    await fetch(schemaPath, { method: "HEAD" });
  } else {
    const schemaFileExists = await fs.pathExists(
      path.resolve(blockSourceFolder, schemaPath),
    );
    if (!schemaFileExists) {
      throw new Error(
        `block-metadata.json 'schema' path '${schemaPath}' does not exist`,
        {
          cause: { code: "INVALID_PACKAGE_CONTENTS" },
        },
      );
    }
  }

  const now = new Date().toISOString();

  // for blocks developed locally, add a prefix to the storage URL - the R2 bucket is shared across all dev environments
  let storageNamespacePrefix = "";
  if (!isRunningOnVercel) {
    const exec = promisify(child_process.exec);

    const gitConfigUserNameResult = await exec("git config --get user.name");
    const userName = gitConfigUserNameResult.stdout.trim();
    storageNamespacePrefix = `local-dev/${slugify(userName, {
      lower: true,
      strict: true,
    })}/`;
  }

  /**
   * In future we will store each version in its own folder, and add the version to the folder path
   * @see https://app.asana.com/0/0/1202539910143057/f (internal)
   */
  const remoteStoragePrefix = `${storageNamespacePrefix}${stripLeadingAt(
    pathWithNamespace,
  )}`;
  const publicPackagePath = `${publicBaseR2Url}/${remoteStoragePrefix}`;

  const sourceInformation = {
    blockDistributionFolderUrl: publicPackagePath,
    npmPackageName,
    pathWithNamespace,
    repository:
      typeof packageJson.repository === "object" && !!packageJson.repository
        ? (packageJson.repository as BlockMetadataRepository)
        : undefined,
    repoDirectory:
      typeof packageJson.repository === "object" &&
      packageJson.repository &&
      "directory" in packageJson.repository &&
      typeof packageJson.repository.directory === "string"
        ? packageJson.repository?.directory
        : undefined,
  };

  const expandedMetadata = expandBlockMetadata({
    metadata: metadataJson as BlockMetadata, // @todo add a comprehensive guard/validator for block-metadata.json
    source: sourceInformation,
    timestamps: { createdAt: now, lastUpdated: now },
    includesExampleGraph,
  });

  fs.writeFileSync(
    path.resolve(packageFolder, metadataJsonPath),
    JSON.stringify(expandedMetadata, undefined, 2),
  );

  /**
   * Wipe the folder before uploading new files - we will stop doing this when we store each version in its own folder
   * @see https://app.asana.com/0/0/1202539910143057/f (internal)
   */
  await wipeR2BlockFolder(remoteStoragePrefix);

  await Promise.all(
    uploadBlockFilesToR2(blockSourceFolder, remoteStoragePrefix),
  );

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
  if (blockLinkedToPackage) {
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
