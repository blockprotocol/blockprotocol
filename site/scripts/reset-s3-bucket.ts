import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import chalk from "chalk";

import { getS3BucketName, getS3Client } from "../src/lib/s3";

// Actions done in the following script should be _idempotent_ as they run in dev/prod
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
        Bucket: getS3BucketName(),
      }),
    );

    const objectsToDelete = bucketContents?.Contents?.map(({ Key }) => ({
      Key,
    })).filter((identifier): identifier is { Key: string } => !!identifier.Key);

    if (objectsToDelete) {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: getS3BucketName(),
          Delete: {
            Objects: objectsToDelete,
          },
        }),
      );
    }

    await s3Client.send(
      new DeleteBucketCommand({
        Bucket: getS3BucketName(),
      }),
    );
  } catch (error) {
    if (`${error}` !== "NoSuchBucket: The specified bucket does not exist") {
      throw error;
    }
  }

  await s3Client.send(
    new CreateBucketCommand({
      Bucket: getS3BucketName(),
    }),
  );

  console.log("✅ Bucket created");
};

await script();
