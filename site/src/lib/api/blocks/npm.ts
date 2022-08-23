import {
  BlockMetadata,
  BlockMetadataRepository,
  JsonObject,
} from "@blockprotocol/core";
import execa from "execa";
import fs from "fs-extra";
import glob from "glob";
import { Db } from "mongodb";
import path from "node:path";
import tmp from "tmp-promise";

import { extendBlockMetadata } from "../../blocks";
import { User } from "../model/user.model";
import { insertDbBlock } from "./db";
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
  includesExampleGraph: boolean;
  metadataJson: JsonObject;
  packageJson: JsonObject;
  publicPackagePath: string;
}> => {
  const { path: npmTarballFolder, cleanup: cleanupDistFolder } = await tmp.dir({
    unsafeCleanup: true,
  });

  const execaOptions = { cwd: npmTarballFolder };

  // download and unpack the package from npm
  let tarballFilename;
  try {
    ({ stdout: tarballFilename } = await execa(
      "npm",
      ["pack", npmPackageName],
      execaOptions,
    ));
    await execa("tar", ["-xf", tarballFilename], execaOptions);
  } catch {
    throw new Error(
      `Could not retrieve npm package '${npmPackageName}'. Does it exist?`,
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
    throw new Error("No block-metadata.json present in package");
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
      throw new Error(`block-metadata.json must contain a '${key}' property`);
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
      );
    }
  }

  // wipe the block's remote folder and upload the latest files
  const remoteStoragePrefix = stripLeadingAt(pathWithNamespace);
  await wipeR2BlockFolder(remoteStoragePrefix);
  await Promise.all(
    uploadBlockFilesToR2(blockSourceFolder, remoteStoragePrefix),
  );

  void cleanupDistFolder();

  return {
    includesExampleGraph,
    metadataJson,
    packageJson,
    publicPackagePath: `${publicBaseR2Url}/${remoteStoragePrefix}`,
  };
};

export const publishBlockFromNpm = async (
  db: Db,
  params: { name: string; npmPackageName: string; user: User },
) => {
  const { name, npmPackageName, user } = params;
  const pathWithNamespace = `@${user.shortname}/${name}`;
  const { includesExampleGraph, metadataJson, packageJson, publicPackagePath } =
    await mirrorNpmPackageToR2(npmPackageName, pathWithNamespace);

  const now = new Date().toISOString();

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

  const extendedMetadata = extendBlockMetadata({
    metadata: metadataJson as BlockMetadata, // @todo add a comprehensive guard/validator for block-metadata.json
    source: sourceInformation,
    timestamps: { createdAt: now, lastUpdated: now },
    includesExampleGraph,
  });

  await insertDbBlock(extendedMetadata);

  return extendedMetadata;
};
