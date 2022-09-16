import { BlockMetadata } from "@blockprotocol/core";
import S3 from "aws-sdk/clients/s3";
import execa from "execa";
import fs from "fs-extra";
import { globby } from "globby";
import mime from "mime-types";
import path from "node:path";
import slugify from "slugify";

import { expandBlockMetadata, ExpandedBlockMetadata } from "../../blocks";
import { isProduction } from "../../config";
import { isRunningOnVercel } from "./shared";

const cloudflareEndpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
const bucketName = isProduction ? "blocks" : "blocks-dev";
const baseS3Options = { Bucket: bucketName };

export const publicBaseR2Url = `https://${bucketName}.hashai.workers.dev`;

const s3 = new S3({
  endpoint: cloudflareEndpoint,
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

const stripLeadingAt = (pathWithNamespace: string) =>
  pathWithNamespace.replace(/^@/, "");

const validateBlockFiles = async (
  blockSourceFolder: string,
): Promise<{
  metadataJson: BlockMetadata;
  metadataJsonPath: string;
  includesExampleGraph: boolean;
}> => {
  // get the block-metadata.json
  const metadataJsonPath = (
    await globby("**/block-metadata.json", {
      absolute: true,
      cwd: blockSourceFolder,
      caseSensitiveMatch: false,
    })
  )[0];
  if (!metadataJsonPath) {
    throw new Error("No block-metadata.json present in package", {
      cause: { code: "INVALID_PACKAGE_CONTENTS" },
    });
  }

  let metadataJson;
  try {
    const metadataJsonString = fs.readFileSync(metadataJsonPath).toString();
    metadataJson = JSON.parse(metadataJsonString);
  } catch (err) {
    throw new Error(
      `Could not parse block-metadata.json: ${(err as Error).message}`,
      {
        cause: { code: "INVALID_PACKAGE_CONTENTS" },
      },
    );
  }

  // check if we have 'example-graph.json', which we then construct a URL for in the extended metadata
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
  const missingSchemaError = new Error(
    `block-metadata.json 'schema' path '${schemaPath}' does not exist`,
    {
      cause: { code: "INVALID_PACKAGE_CONTENTS" },
    },
  );
  if (schemaPath.startsWith("http")) {
    try {
      await fetch(schemaPath, { method: "HEAD" });
    } catch {
      throw missingSchemaError;
    }
  } else {
    const schemaFileExists = await fs.pathExists(
      path.resolve(blockSourceFolder, schemaPath),
    );
    if (!schemaFileExists) {
      throw missingSchemaError;
    }
  }

  return { metadataJson, metadataJsonPath, includesExampleGraph };
};

/**
 * Uploads files to the 'blocks' bucket in Cloudflare's R2 storage.
 * Returns an array of the paths to the uploaded files within the bucket.
 * @param localFolderPath the path to the directory in the local file system containing the files to upload
 * @param remoteStoragePrefix the prefix to give the files in R2, in the format [namespace]/[block-name]
 */
const uploadBlockFilesToR2 = (
  localFolderPath: string,
  remoteStoragePrefix: string,
): Promise<any /** @todo fix this */>[] => {
  if (!/.+\/.+/.test(remoteStoragePrefix)) {
    throw new Error(
      `Expected prefix matching pattern [namespace]/[block-name], received '${remoteStoragePrefix}'`,
    );
  }

  const thingsInFolder = fs.readdirSync(localFolderPath);

  return thingsInFolder.flatMap((thingName) => {
    const pathToThing = path.resolve(localFolderPath, thingName);
    const isDirectory = fs.lstatSync(pathToThing).isDirectory();
    if (isDirectory) {
      return uploadBlockFilesToR2(
        pathToThing,
        `${remoteStoragePrefix}/${thingName}`,
      );
    }
    const fileContents = fs.readFileSync(pathToThing).toString();

    const contentType = mime.lookup(thingName);

    return s3
      .putObject({
        ...baseS3Options,
        Body: fileContents,
        ContentType: contentType || undefined,
        Key: `${remoteStoragePrefix}/${thingName}`,
      })
      .promise();
  });
};

/**
 * Wipes the contents of a block's distribution folder in R2
 * @param blockFolder the path to the folder, in the format [namespace]/[block-name]
 */
const wipeR2BlockFolder = async (blockFolder: string) => {
  if (!/.+\/.+/.test(blockFolder)) {
    throw new Error(
      `Expected block folder matching pattern [namespace]/[block-name], received '${blockFolder}'`,
    );
  }
  const folderContents = await s3
    .listObjectsV2({
      ...baseS3Options,
      Prefix: blockFolder,
    })
    .promise();

  if (!folderContents.Contents || folderContents.Contents.length === 0) {
    return;
  }

  const objectsToDelete = folderContents.Contents.map(({ Key }) => ({
    Key,
  })).filter((identifier): identifier is { Key: string } => !!identifier.Key);

  await s3
    .deleteObjects({
      ...baseS3Options,
      Delete: {
        Objects: objectsToDelete,
      },
    })
    .promise();
};

/**
 * 1. Validates block files
 * 2. Expands the provided metadata
 * 3. Uploads files to the 'blocks' bucket in Cloudflare's R2 storage
 * @param createdAt if this is an already-registered block, the date it was created, otherwise null
 * @param localFolderPath the path to the directory in the local file system containing the files to upload
 * @param [npmPackageName] the npm package this block is published under, if any
 * @param pathWithNamespace the block's namespace and slug, in the format [namespace]/[block-name]
 */
export const validateExpandAndUploadBlockFiles = async ({
  createdAt,
  localFolderPath,
  npmPackageName,
  pathWithNamespace,
}: {
  createdAt: string | null;
  localFolderPath: string;
  npmPackageName?: string;
  pathWithNamespace: string;
}): Promise<{ expandedMetadata: ExpandedBlockMetadata }> => {
  // for blocks developed locally, add a prefix to the storage URL - the R2 bucket is shared across all dev environments
  let storageNamespacePrefix = "";
  if (!isRunningOnVercel) {
    const gitConfigUserNameResult = await execa("git", [
      "config",
      "--get",
      "user.name",
    ]);
    const userName = gitConfigUserNameResult.stdout.trim();
    storageNamespacePrefix = `local-dev/${slugify(userName, {
      lower: true,
      strict: true,
    })}/`;
  }

  // Validate the contents of the block files
  const { metadataJson, metadataJsonPath, includesExampleGraph } =
    await validateBlockFiles(localFolderPath);

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
      !!metadataJson.repository &&
      (typeof metadataJson.repository === "object" ||
        typeof metadataJson.repository === "string")
        ? metadataJson.repository
        : undefined,
    repoDirectory:
      typeof metadataJson.repository === "object" &&
      metadataJson.repository &&
      "directory" in metadataJson.repository &&
      typeof metadataJson.repository.directory === "string"
        ? metadataJson.repository?.directory
        : undefined,
  };

  const now = new Date().toISOString();

  const expandedMetadata = await expandBlockMetadata({
    metadata: metadataJson,
    source: sourceInformation,
    timestamps: { createdAt: createdAt ?? now, lastUpdated: now },
    includesExampleGraph,
  });

  fs.writeFileSync(
    path.resolve(localFolderPath, metadataJsonPath),
    JSON.stringify(expandedMetadata, undefined, 2),
  );

  /**
   * Wipe the folder before uploading new files - we will stop doing this when we store each version in its own folder
   * @see https://app.asana.com/0/0/1202539910143057/f (internal)
   */
  await wipeR2BlockFolder(remoteStoragePrefix);

  await Promise.all(uploadBlockFilesToR2(localFolderPath, remoteStoragePrefix));

  return { expandedMetadata };
};
