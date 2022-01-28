/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import { User, UserDocument } from "../src/lib/model/user.model";
import {
  VerificationCode,
  VerificationCodeDocument,
} from "../src/lib/model/verificationCode.model";
import { connectToDatabase } from "../src/lib/mongodb";
import { EntityType } from "../src/lib/model/entityType.model";

// Actions done in the following script should be _idempotent_ as they run in dev/prod
void (async () => {
  const { client, db } = await connectToDatabase();
  await db
    .collection<UserDocument>(User.COLLECTION_NAME)
    .createIndex({ email: 1 }, { unique: true });

  await db
    .collection(EntityType.COLLECTION_NAME)
    .createIndex({ entityTypeId: 1 }, { unique: true });

  await db
    .collection(EntityType.COLLECTION_NAME)
    .createIndex({ user: 1, "schema.title": 1 }, { unique: true });

  await db
    .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
    .createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: VerificationCode.PRUNE_AGE_MS / 60 },
    );

  await client.close();
  console.log("✅ Created MongoDB indexes");
})();
