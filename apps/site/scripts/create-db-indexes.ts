import chalk from "chalk";

import { EntityType } from "../src/lib/api/model/entity-type.model";
import { User, UserDocument } from "../src/lib/api/model/user.model";
import {
  VerificationCode,
  VerificationCodeDocument,
} from "../src/lib/api/model/verification-code.model";
import { connectToDatabase } from "../src/lib/api/mongodb";

const catchAndLog = async (func: () => Promise<void>) => {
  try {
    await func();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error trying to create index, ${error.toString()}`);
    }
  }
};

// Actions done in the following script should be _idempotent_ as they run in dev/prod
const script = async () => {
  console.log(chalk.bold("Creating DB indexes..."));

  const { client, db } = await connectToDatabase();
  await catchAndLog(async () => {
    await db
      .collection<UserDocument>(User.COLLECTION_NAME)
      .createIndex({ email: 1 }, { unique: true, sparse: true });
  });

  await catchAndLog(async () => {
    await db
      .collection<UserDocument>(User.COLLECTION_NAME)
      .createIndex({ shortname: 1 }, { unique: true, sparse: true });
  });

  await catchAndLog(async () => {
    await db
      .collection(EntityType.COLLECTION_NAME)
      .createIndex({ entityTypeId: 1 }, { unique: true });
  });

  // @todo re-enable this when schema is jsonb again. it's currently a string
  // await catchAndLog(async () => {
  //   await db
  //     .collection(EntityType.COLLECTION_NAME)
  //     .createIndex({ user: 1, "schema.title": 1 }, { unique: true });
  // });

  await catchAndLog(async () => {
    await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: VerificationCode.PRUNE_AGE_MS / 60 },
      );
  });

  await client.close();
  console.log("✅ MongoDB indexes created");
};

await script();
