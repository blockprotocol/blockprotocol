import { Db, DBRef, ObjectId, WithId } from "mongodb";
import { NextApiResponse } from "next";
import { rword } from "rword";

import { formatErrors } from "../../../util/api";
import { User } from "./user.model";

export type VerificationCodeVariant = "login" | "email" | "linkWordpress";

export type VerificationCodeWordPressUrls = {
  settings: string;
  instance: string;
};

export type VerificationCodeProperties = {
  user: DBRef;
  code: string;
  numberOfAttempts: number;
  used: boolean;
  createdAt: Date;
  variant: VerificationCodeVariant;
  wordPressUrls?: VerificationCodeWordPressUrls;
};

// @note we can't use a discriminated union here because it's used to set the properties of VerificationCode, which can't have discriminated unions
export type VerificationCodePropertiesVariant = Pick<
  VerificationCodeProperties,
  "variant" | "wordPressUrls"
>;

export type VerificationCodeDocument = WithId<VerificationCodeProperties>;

type VerificationCodeConstructorArgs = {
  id: string;
} & VerificationCodeProperties;

export class VerificationCode {
  id: string;

  variant: VerificationCodeVariant;

  user: DBRef;

  code: string;

  numberOfAttempts: number;

  used: boolean;

  createdAt: Date;

  wordPressUrls?: VerificationCodeWordPressUrls;

  static COLLECTION_NAME = "bp-verification-codes";

  // Maximum age of a valid verification code (1 hour)
  static MAX_AGE_MS = 1000 * 60 * 60;

  // Maximum number of times a user is able to attempt to verify their verification code
  static MAX_ATTEMPTS = 5;

  // Maximum age of a verification code before it can be pruned from the datastore
  static PRUNE_AGE_MS = 1000 * 60 * 60 * 24 * 7;

  private static generateCode() {
    return (rword.generate(4) as string[]).join("-");
  }

  constructor({
    id,
    variant,
    user,
    code,
    numberOfAttempts,
    used,
    createdAt,
    wordPressUrls,
  }: VerificationCodeConstructorArgs) {
    this.id = id;
    this.variant = variant;
    this.user = user;
    this.code = code;
    this.numberOfAttempts = numberOfAttempts;
    this.used = used;
    this.createdAt = createdAt;
    this.wordPressUrls = wordPressUrls;
  }

  static fromDocument({ _id, ...remainingDocument }: VerificationCodeDocument) {
    return new VerificationCode({
      id: _id.toString(),
      ...remainingDocument,
    });
  }

  static async create(
    db: Db,
    params: { user: User } & VerificationCodePropertiesVariant,
  ) {
    const { user, ...variantParams } = params;

    const properties: VerificationCodeProperties = {
      used: false,
      user: user.toRef(),
      numberOfAttempts: 0,
      code: VerificationCode.generateCode(),
      createdAt: new Date(),
      ...variantParams,
    };

    const { insertedId: _id } = await db
      .collection<Omit<VerificationCodeDocument, "_id">>(this.COLLECTION_NAME)
      .insertOne(properties);

    return VerificationCode.fromDocument({ _id, ...properties });
  }

  hasExceededMaximumAttempts() {
    return this.numberOfAttempts >= VerificationCode.MAX_ATTEMPTS;
  }

  hasExpired() {
    return (
      this.createdAt.getTime() <
      new Date().getTime() - VerificationCode.MAX_AGE_MS
    );
  }

  hasBeenUsed() {
    return this.used;
  }

  validate(
    res: NextApiResponse,
    { errorPrefix }: { errorPrefix: string },
  ): boolean {
    if (this.hasBeenUsed()) {
      res.status(403).json(
        formatErrors({
          msg: `${errorPrefix || "Verification"} code has already been used`,
        }),
      );
      return false;
    } else if (this.hasExceededMaximumAttempts()) {
      res.status(403).json(
        formatErrors({
          msg: `${
            errorPrefix || "Verification"
          } code has been used too many times`,
        }),
      );
      return false;
    } else if (this.hasExpired()) {
      res.status(403).json(
        formatErrors({
          msg: `${errorPrefix || "Verification"} code has expired`,
        }),
      );
      return false;
    }

    return true;
  }

  async incrementAttempts(db: Db) {
    const { value } = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(this.id) },
        { $inc: { numberOfAttempts: 1 } },
        { returnDocument: "after" },
      );

    if (value) {
      this.numberOfAttempts = value.numberOfAttempts;
    }
  }

  async setToUsed(db: Db) {
    await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(this.id) }, { $set: { used: true } });

    this.used = true;
  }
}
