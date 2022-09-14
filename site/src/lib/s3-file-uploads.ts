import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import mime from "mime-types";
import path from "node:path";

import { generateS3ResourceUrl, getS3Bucket, getS3Client } from "./s3";

export const uploadToS3 = async (
  filename: string,
  buffer: Buffer,
): Promise<{
  fullUrl: string;
  s3Key: string;
  s3Folder: string;
}> => {
  const client = getS3Client();
  const extension = path.extname(filename);

  // AWS doesn't detect/apply SVG metadata properly
  let Metadata: any;
  let ContentType: string | undefined;
  if (extension.toLowerCase() === "svg") {
    Metadata = {
      "Content-Type": "image/svg+xml",
    };
    ContentType = "image/svg+xml";
  }
  const ACL = "public-read";

  const params: PutObjectCommandInput = {
    Key: filename,
    Body: buffer,
    ACL,
    Bucket: getS3Bucket(),
    ContentType,
    Metadata,
  };
  const command = new PutObjectCommand(params);

  let fullUrl;
  const Key = filename;
  try {
    // PutObjectCommand does not return the full URL for an uploaded file.
    // the AWS lib-storage API would do this through Upload, but even it is currently not returning the correct values.
    // see https://github.com/aws/aws-sdk-js-v3/pull/2700
    // The below URL construction is based on above PR.
    await client.send(command);

    fullUrl = generateS3ResourceUrl(params.Key!);
  } catch (error) {
    throw new Error(`Could not upload image. ${error}`);
  }

  const s3Folder = filename
    .split(/(?=\/)/)
    .slice(0, -1)
    .join("");

  return {
    fullUrl,
    s3Key: Key,
    s3Folder,
  };
};

/**
 * upload a file/blob to S3
 */
export const uploadFileBufferToS3 = async (
  fileBuffer: Buffer,
  mimeType: string,
  filename: string,
  folder: string,
): Promise<{
  fullUrl: string;
  s3Key: string;
}> => {
  const extension = mime.extension(mimeType);
  if (!extension) {
    throw new Error(`Could not determine extension from file upload`);
  }

  const { fullUrl, s3Key } = await uploadToS3(
    `${folder}/${filename}.${extension}`,
    fileBuffer,
  );
  return {
    fullUrl,
    s3Key,
  };
};
