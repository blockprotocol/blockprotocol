import S3 from "aws-sdk/clients/s3";
import fs from "fs-extra";
import mime from "mime-types";
import path from "node:path";

import { isProduction } from "../../config";

const cloudflareEndpoint =
  "https://c6499786332a3d2fb35419a7803ab7aa.r2.cloudflarestorage.com";
const bucketName = isProduction ? "blocks" : "blocks-dev";
const baseS3Options = { Bucket: bucketName };

export const publicBaseR2Url = `https://${bucketName}.hashai.workers.dev`;

const s3 = new S3({
  endpoint: cloudflareEndpoint,
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

/**
 * Uploads files to the 'blocks' bucket in Cloudflare's R2 storage.
 * Returns an array of the paths to the uploaded files within the bucket.
 * @param localFolderPath the path to the directory in the local file system containing the files to upload
 * @param remoteStoragePrefix the prefix to give the files in R2, in the format [namespace]/[block-name]
 */
export const uploadBlockFilesToR2 = (
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
export const wipeR2BlockFolder = async (blockFolder: string) => {
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
