/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import { User, UserProperties } from "../src/lib/model/user.model";
import {
  VerificationCode,
  VerificationCodeDocument,
} from "../src/lib/model/verificationCode.model";
import { connectToDatabase } from "../src/lib/mongodb";

void (async () => {
  const { client, db } = await connectToDatabase();

  const existingCollections = await db.collections();

  if (
    existingCollections.find(
      ({ collectionName }) => collectionName === User.COLLECTION_NAME,
    )
  ) {
    await db.dropCollection(User.COLLECTION_NAME);
  }

  await db.createCollection(User.COLLECTION_NAME);

  if (
    existingCollections.find(
      ({ collectionName }) =>
        collectionName === VerificationCode.COLLECTION_NAME,
    )
  ) {
    await db.dropCollection(VerificationCode.COLLECTION_NAME);
  }

  await db.createCollection(VerificationCode.COLLECTION_NAME);

  await db
    .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
    .createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: VerificationCode.PRUNE_AGE_MS / 60 },
    );

  const mockUsers: Omit<UserProperties, "loginCodes">[] = [
    {
      preferredName: "Alice",
      email: "alice@example.com",
    },
  ];

  await Promise.all(mockUsers.map((params) => User.create(db, params)));

  await client.close();
})();
