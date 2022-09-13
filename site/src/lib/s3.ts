import { S3Client } from "@aws-sdk/client-s3";
import * as envalid from "envalid";

let s3Client: S3Client | undefined;

export const getS3Client = (): S3Client => {
  if (!s3Client) {
    const env = envalid.cleanEnv(process.env, {
      S3_API_ENDPOINT: envalid.str(),
      S3_BUCKET_NAME: envalid.str(),
      S3_ACCESS_KEY_ID: envalid.str(),
      S3_SECRET_ACCESS_KEY: envalid.str(),
      S3_BASE_URL: envalid.str(),
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

let s3BucketName: string | undefined;

export const getS3BucketName = (): string => {
  if (!s3BucketName) {
    const env = envalid.cleanEnv(process.env, {
      S3_BUCKET_NAME: envalid.str(),
    });

    s3BucketName = env.S3_BUCKET_NAME;
  }
  return s3BucketName;
};

let s3BaseUrl: string | undefined;

export const getS3BaseUrl = (): string => {
  if (!s3BaseUrl) {
    const env = envalid.cleanEnv(process.env, {
      S3_BASE_URL: envalid.str(),
    });

    s3BaseUrl = env.S3_BASE_URL;
  }
  return s3BaseUrl;
};
