import S3 from "aws-sdk/clients/s3";
import * as envalid from "envalid";
import fs from "fs-extra";
import mime from "mime-types";
import path from "node:path";

const env = envalid.cleanEnv(process.env, {
  S3_API_ENDPOINT: envalid.str(),
  S3_BUCKET: envalid.str(),
  S3_ACCESS_KEY_ID: envalid.str(),
  S3_SECRET_ACCESS_KEY: envalid.str(),
});

const s3 = new S3({
  endpoint: env.S3_API_ENDPOINT,
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
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
        Bucket: env.S3_BUCKET,
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
      Bucket: env.S3_BUCKET,
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
      Bucket: env.S3_BUCKET,
      Delete: {
        Objects: objectsToDelete,
      },
    })
    .promise();
};
