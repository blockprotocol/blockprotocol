import chalk from "chalk";
import { User, UserProperties } from "../src/lib/api/model/user.model";
import { ApiKey } from "../src/lib/api/model/apiKey.model";
import { VerificationCode } from "../src/lib/api/model/verificationCode.model";
import { connectToDatabase } from "../src/lib/api/mongodb";
import { EntityType } from "../src/lib/api/model/entityType.model";

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
      ({ collectionName }) => collectionName === EntityType.COLLECTION_NAME,
    )
  ) {
    await db.dropCollection(EntityType.COLLECTION_NAME);
  }

  await db.createCollection(EntityType.COLLECTION_NAME);

  if (
    existingCollections.find(
      ({ collectionName }) =>
        collectionName === VerificationCode.COLLECTION_NAME,
    )
  ) {
    await db.dropCollection(VerificationCode.COLLECTION_NAME);
  }

  await db.createCollection(VerificationCode.COLLECTION_NAME);

  const mockUsers: UserProperties[] = [
    {
      shortname: "alice",
      preferredName: "Alice",
      email: "alice@example.com",
    },
  ];

  await Promise.all(
    mockUsers.map((params) =>
      User.create(db, { ...params, hasVerifiedEmail: true }),
    ),
  );

  await client.close();
  console.log("✅ DB seeded");

  await (
    await import("./create-db-indexes")
  ).default;
};

export default script();
