import { S3Client } from "@aws-sdk/client-s3";
import * as envalid from "envalid";

let s3Client: S3Client | undefined;

export const getS3Client = (): S3Client => {
  if (!s3Client) {
    const env = envalid.cleanEnv(process.env, {
      S3_API_ENDPOINT: envalid.str(),
      S3_BUCKET: envalid.str(),
      S3_ACCESS_KEY_ID: envalid.str(),
      S3_SECRET_ACCESS_KEY: envalid.str(),
    });

    s3Client = new S3Client({
      endpoint: env.S3_API_ENDPOINT,
      region: "us-east-1",
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

  return s3Client;
};

let s3Bucket: string | undefined;

export const getS3Bucket = (): string => {
  if (!s3Bucket) {
    const env = envalid.cleanEnv(process.env, {
      S3_BUCKET: envalid.str(),
    });

    s3Bucket = env.S3_BUCKET;
  }

  return s3Bucket;
};

export const resolveS3ResourceKey = (
  category: "blocks" | "block-uploads" | "avatars",
  subkey: string,
): string => {
  return `${category}/${subkey}`;
};

let s3BaseUrl: string | undefined;

const getS3BaseUrl = (): string => {
  if (!s3BaseUrl) {
    const env = envalid.cleanEnv(process.env, {
      S3_BASE_URL: envalid.str(),
    });

    s3BaseUrl = env.S3_BASE_URL.replace(/\/$/, "");
  }

  return s3BaseUrl;
};

export const generateS3ResourceUrl = (
  resolvedS3ResourceKey: string,
): string => {
  return `${getS3BaseUrl()}/${resolvedS3ResourceKey
    .split("/")
    .map((segment: string) => encodeURIComponent(segment))
    .join("/")}`;
};
