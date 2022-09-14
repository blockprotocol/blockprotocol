import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import mime from "mime-types";

import { mustGetEnvVar } from "../util/api";
import { isProduction } from "./config";

export const defaultBucket =
  process.env.BP_AWS_S3_BUCKET_NAME ?? "blockprotocol";

const getClient = () => {
  return new S3Client({
    region: mustGetEnvVar("BP_AWS_REGION"),
    credentials: {
      accessKeyId: mustGetEnvVar("BP_AWS_ACCESS_KEY_ID"),
      secretAccessKey: mustGetEnvVar("BP_AWS_SECRET_ACCESS_KEY"),
    },
  });
};

export const uploadToS3 = async (
  filenameWithoutExtension: string,
  extension: string,
  buffer: Buffer,
  bucket?: string,
): Promise<{
  fullUrl: string;
  s3Key: string;
  s3Folder: string;
}> => {
  const client = getClient();

  let filename = `${filenameWithoutExtension}.${extension}`;
  if (!isProduction && !filename.startsWith("dev/")) {
    filename = `dev/${filename}`;
  }

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

  const Bucket = bucket ?? defaultBucket;
  const params: PutObjectCommandInput = {
    Key: filename,
    Body: buffer,
    ACL,
    Bucket,
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

    const [_putResult, endpoint] = await Promise.all([
      client.send(command),
      client.config.endpoint(),
    ]);

    const locationKey = params
      .Key!.split("/")
      .map((segment: string) => encodeURIComponent(segment))
      .join("/");

    fullUrl = `${endpoint.protocol}//${Bucket}.${endpoint.hostname}/${locationKey}`;
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
    `${folder}/${filename}`,
    extension,
    fileBuffer,
  );
  return {
    fullUrl,
    s3Key,
  };
};
