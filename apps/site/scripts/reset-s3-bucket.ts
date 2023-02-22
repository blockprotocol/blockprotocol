import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import chalk from "chalk";

import { getS3Bucket, getS3Client } from "../src/lib/s3";

const script = async () => {
  console.log(chalk.bold("Resetting S3 bucket..."));

  const s3Client = getS3Client();
  const { hostname } = await s3Client.config.endpoint();
  if (hostname !== "localhost") {
    console.warn(
      "You are attempting to reset an S3 bucket on a non-local endpoint, skipping",
    );

    return;
  }

  try {
    const bucketContents = await getS3Client().send(
      new ListObjectsV2Command({
        Bucket: getS3Bucket(),
      }),
    );

    const objectsToDelete = bucketContents?.Contents?.map(({ Key }) => ({
      Key,
    })).filter((identifier): identifier is { Key: string } => !!identifier.Key);

    if (objectsToDelete) {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: getS3Bucket(),
          Delete: {
            Objects: objectsToDelete,
          },
        }),
      );
    }

    await s3Client.send(
      new DeleteBucketCommand({
        Bucket: getS3Bucket(),
      }),
    );
  } catch (error) {
    if (`${error}` !== "NoSuchBucket: The specified bucket does not exist") {
      throw error;
    }
  }

  const Bucket = getS3Bucket();

  await s3Client.send(
    new CreateBucketCommand({
      Bucket,
    }),
  );

  // Calling CreateBucketCommand with `ACL: "public-read",` does not make bucket files available
  // to the public. We set permissions separately to fix that.
  // https://stackoverflow.com/a/69079415/1818285
  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: getS3Bucket(),
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:GetObject"],
            Effect: "Allow",
            Principal: {
              AWS: ["*"],
            },
            Resource: [`arn:aws:s3:::${Bucket}/*`],
            Sid: "",
          },
        ],
      }),
    }),
  );

  console.log("✅ Bucket created");
};

await script();
