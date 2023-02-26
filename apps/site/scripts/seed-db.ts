import chalk from "chalk";

import { blocksDbCollectionName } from "../src/lib/api/blocks/shared";
import { ApiKey } from "../src/lib/api/model/api-key.model";
import { User, UserProperties } from "../src/lib/api/model/user.model";
import { VerificationCode } from "../src/lib/api/model/verification-code.model";
import { connectToDatabase } from "../src/lib/api/mongodb";
import { COLLECTION_NAME as ENTITY_TYPE_COLLECTION_NAME } from "../src/pages/api/types/entity-type/shared/db";
import { COLLECTION_NAME as PROPERTY_TYPE_COLLECTION_NAME } from "../src/pages/api/types/property-type/shared/db";

const script = async () => {
  console.log(chalk.bold("Seeding DB..."));
  const { client, db } = await connectToDatabase();

  const existingCollections = await db.collections();

  if (
    existingCollections.find(
      ({ collectionName }) => collectionName === User.COLLECTION_NAME,
    )
  ) {
    if ((await db.collection(User.COLLECTION_NAME).count()) > 50) {
      console.warn(`
        You are attempting to drop a collection with a large number of users.
        Are you sure you're connecting to the right database?
        Please edit the script in which this message appears if you're sure.
        `);
      process.exit();
    }
    await db.dropCollection(User.COLLECTION_NAME);
  }

  await db.createCollection(User.COLLECTION_NAME);

  if (
    existingCollections.find(
      ({ collectionName }) => collectionName === ApiKey.COLLECTION_NAME,
    )
  ) {
    await db.dropCollection(ApiKey.COLLECTION_NAME);
  }

  await db.createCollection(ApiKey.COLLECTION_NAME);

  if (
    existingCollections.find(
      ({ collectionName }) => collectionName === ENTITY_TYPE_COLLECTION_NAME,
    )
  ) {
    await db.dropCollection(ENTITY_TYPE_COLLECTION_NAME);
  }

  await db.createCollection(ENTITY_TYPE_COLLECTION_NAME);

  if (
    existingCollections.find(
      ({ collectionName }) => collectionName === PROPERTY_TYPE_COLLECTION_NAME,
    )
  ) {
    await db.dropCollection(PROPERTY_TYPE_COLLECTION_NAME);
  }

  await db.createCollection(PROPERTY_TYPE_COLLECTION_NAME);

  if (
    existingCollections.find(
      ({ collectionName }) =>
        collectionName === VerificationCode.COLLECTION_NAME,
    )
  ) {
    await db.dropCollection(VerificationCode.COLLECTION_NAME);
  }

  await db.createCollection(VerificationCode.COLLECTION_NAME);

  if (
    existingCollections.find(
      ({ collectionName }) => collectionName === blocksDbCollectionName,
    )
  ) {
    await db.dropCollection(blocksDbCollectionName);
  }

  await db.createCollection(blocksDbCollectionName);

  const mockUsers: UserProperties[] = [
    {
      shortname: "alice",
      preferredName: "Alice",
      email: "alice@example.com",
    },
    {
      shortname: "bob",
      preferredName: "Bob",
      email: "bob@example.com",
    },
    {
      shortname: "hash",
      preferredName: "HASH",
      email: "hash@example.com",
    },
  ];

  await Promise.all(
    mockUsers.map((params) =>
      User.create(db, { ...params, hasVerifiedEmail: true }),
    ),
  );

  await client.close();
  console.log("✅ DB seeded");

  await import("./create-db-indexes");
  await import("./reset-s3-bucket");
};

await script();
