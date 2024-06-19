import path from "node:path";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BlockMetadata } from "@blockprotocol/core";
import fs from "fs-extra";
import { globby } from "globby";
import mime from "mime-types";

import { expandBlockMetadata, ExpandedBlockMetadata } from "../../blocks";
import {
  generateS3ResourceUrl,
  getS3Bucket,
  getS3Client,
  resolveS3ResourceKey,
} from "../../s3";

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
 * Uploads files to the 'blocks' bucket in S3-compatible storage.
 * Returns an array of the paths to the uploaded files within the bucket.
 * @param localFolderPath the path to the directory in the local file system containing the files to upload
 * @param remoteStoragePrefix the prefix to give the files, in the format [namespace]/[block-name]
 */
const uploadBlockFilesToS3 = (
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
      return uploadBlockFilesToS3(
        pathToThing,
        `${remoteStoragePrefix}/${thingName}`,
      );
    }
    const fileContents = fs.readFileSync(pathToThing);

    const contentType = mime.lookup(thingName);
    if (
      contentType &&
      contentType.includes("svg") &&
      fileContents
        .toString()
        .match(
          /(script|entity|onerror|onload|onmouseover|onclick|onfocus|foreignObject)/i,
        )
    ) {
      // don't upload this file. it'll silently be missing
      // @todo consider throwing an error instead here
      return Promise.resolve();
    }

    return getS3Client().send(
      new PutObjectCommand({
        Bucket: getS3Bucket(),
        Body: fileContents,
        ContentType: contentType || undefined,
        Key: `${remoteStoragePrefix}/${thingName}`,
      }),
    );
  });
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
  // Validate the contents of the block files
  const { metadataJson, metadataJsonPath, includesExampleGraph } =
    await validateBlockFiles(localFolderPath);

  /**
   * In future we will store each version in its own folder, and add the version to the folder path
   * @see https://app.asana.com/0/0/1202539910143057/f (internal)
   */
  const remoteStoragePrefix = resolveS3ResourceKey(
    "blocks",
    stripLeadingAt(pathWithNamespace),
  );

  const sourceInformation = {
    blockDistributionFolderUrl: generateS3ResourceUrl(remoteStoragePrefix),
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

  const expandedMetadata = expandBlockMetadata({
    metadata: metadataJson,
    source: sourceInformation,
    timestamps: { createdAt: createdAt ?? now, lastUpdated: now },
    includesExampleGraph,
  });

  fs.writeFileSync(
    path.resolve(localFolderPath, metadataJsonPath),
    JSON.stringify(expandedMetadata, undefined, 2),
  );

  await Promise.all(uploadBlockFilesToS3(localFolderPath, remoteStoragePrefix));

  return { expandedMetadata };
};

export const uploadOriginalTarballToS3 = async ({
  pathWithNamespace,
  tarballFilePath,
  version,
}: {
  pathWithNamespace: string;
  tarballFilePath: string;
  version: string;
}) => {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: getS3Bucket(),
      Body: await fs.readFile(tarballFilePath),
      ContentType: "application/x-gtar",
      Key: resolveS3ResourceKey(
        "block-uploads",
        `${stripLeadingAt(pathWithNamespace)}/${version}.tar.gz`,
      ),
    }),
  );
};
