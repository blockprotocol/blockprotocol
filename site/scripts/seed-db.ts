import { User, UserProperties } from "../src/lib/model/user.model";
import { ApiKey } from "../src/lib/model/apiKey.model";
import { VerificationCode } from "../src/lib/model/verificationCode.model";
import { connectToDatabase } from "../src/lib/mongodb";
import { EntityType } from "../src/lib/model/entityType.model";

const script = async () => {
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
  console.log("✅ Seeded DB");

  await (
    await import("./create-db-indexes")
  ).default;
};

export default script();
