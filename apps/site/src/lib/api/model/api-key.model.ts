import crypto from "node:crypto";

import { Db, DBRef } from "mongodb";
import { v4 as uuid } from "uuid";

import { mustGetEnvVar } from "../../../util/api";
import { User } from "./user.model";

type ApiKeyProperties = {
  createdAt: Date;
  displayName: string;
  hashedString: string;
  lastUsedAt?: Date | null;
  lastUsedOrigin?: string | null;
  publicId: string;
  revokedAt?: Date | null;
  salt: string;
  useCount: number;
  user: DBRef;
};

export type UserFacingApiKeyProperties = Omit<
  ApiKeyProperties,
  "hashedString" | "salt" | "user"
>;

type ApiKeyDocument = ApiKeyProperties;

export class ApiKey {
  createdAt: Date;
  displayName: string;
  hashedString: string;
  lastUsedAt?: Date | null;
  lastUsedOrigin?: string | null;
  publicId: string;
  revokedAt?: Date | null;
  salt: string;
  useCount: number;
  user: DBRef;

  static readonly COLLECTION_NAME = "bp-api-keys";

  private static readonly HASHING_SECRET = mustGetEnvVar("HASHING_SECRET");

  /**
   * This prefix helps to identify keys for both humans and automated code-scanners.
   * It aims to balance human-readability with avoiding false positives (which plain "blocks" might do).
   */
  private static readonly PREFIX = "b10ck5";

  private static readonly PUBLIC_ID_HEX_DIGIT_COUNT = 32;

  private static readonly KEY_FORMAT_REGEXP = new RegExp(
    // e.g. b10ck5.e84a616cedc8822b02ac96761b068f19.91ea0c90-acee-4215-a01e-85a4438af0ea
    `^${ApiKey.PREFIX}\\.[a-z0-9]{${ApiKey.PUBLIC_ID_HEX_DIGIT_COUNT}}\\.[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$`,
  );

  private constructor({
    createdAt,
    displayName,
    hashedString,
    lastUsedAt,
    lastUsedOrigin,
    publicId,
    revokedAt,
    salt,
    useCount,
    user,
  }: ApiKeyProperties) {
    this.createdAt = createdAt;
    this.displayName = displayName;
    this.hashedString = hashedString;
    this.lastUsedAt = lastUsedAt;
    this.lastUsedOrigin = lastUsedOrigin;
    this.publicId = publicId;
    this.revokedAt = revokedAt;
    this.salt = salt;
    this.useCount = useCount;
    this.user = user;
  }

  private static hash({
    publicId,
    privateId,
    salt,
  }: {
    publicId: string;
    privateId: string;
    salt: string;
  }) {
    const stringToHash = `${publicId}.${privateId}.${salt}`;

    return crypto
      .createHmac("sha256", this.HASHING_SECRET)
      .update(stringToHash)
      .digest("hex");
  }

  static async create(
    db: Db,
    params: { displayName: string; user: User },
  ): Promise<string> {
    const { displayName, user } = params;

    const privateId = uuid();
    const publicId = crypto
      .randomBytes(this.PUBLIC_ID_HEX_DIGIT_COUNT / 2)
      .toString("hex");
    const salt = crypto.randomBytes(32).toString("hex");

    const hashedString = this.hash({ privateId, publicId, salt });

    const apiKey = new ApiKey({
      createdAt: new Date(),
      displayName,
      hashedString,
      publicId,
      salt,
      useCount: 0,
      user: user.toRef(),
    });

    await db.collection<ApiKeyDocument>(this.COLLECTION_NAME).insertOne(apiKey);

    return `${this.PREFIX}.${publicId}.${privateId}`;
  }

  private static async getByPublicId(
    db: Db,
    params: { publicId: string },
  ): Promise<ApiKey | null> {
    const apiKeyRecord = await db
      .collection<ApiKeyDocument>(this.COLLECTION_NAME)
      .findOne({
        publicId: params.publicId,
      });

    return apiKeyRecord ? new ApiKey(apiKeyRecord) : null;
  }

  static async getByUser(
    db: Db,
    params: { user: User },
  ): Promise<UserFacingApiKeyProperties[]> {
    const projection: Record<keyof UserFacingApiKeyProperties, 1> = {
      createdAt: 1,
      displayName: 1,
      lastUsedAt: 1,
      lastUsedOrigin: 1,
      publicId: 1,
      revokedAt: 1,
      useCount: 1,
    };

    return await db
      .collection<UserFacingApiKeyProperties>(this.COLLECTION_NAME)
      .find(
        { user: params.user.toRef() },
        {
          projection: {
            ...projection,
            _id: 0,
          },
        },
      )
      .toArray();
  }

  static async validateAndGet(
    db: Db,
    params: { apiKeyString: string; usedAtOrigin?: string },
  ): Promise<ApiKey> {
    const { apiKeyString } = params;

    if (!apiKeyString.match(this.KEY_FORMAT_REGEXP)) {
      throw new Error("API key does not match the expected format.");
    }

    const INVALID_KEY_ERROR_MSG = "Invalid API key.";

    const [_prefix, publicId, privateId] = apiKeyString.split(".") as [
      string,
      string,
      string,
    ]; // This assertion is based on KEY_FORMAT_REGEXP;

    const apiKey = await ApiKey.getByPublicId(db, { publicId });

    if (!apiKey) {
      throw new Error(INVALID_KEY_ERROR_MSG);
    }

    const providedKeyHash = ApiKey.hash({
      publicId,
      privateId,
      salt: apiKey.salt,
    });
    if (providedKeyHash !== apiKey.hashedString) {
      throw new Error(INVALID_KEY_ERROR_MSG);
    } else if (apiKey.isRevoked()) {
      throw new Error("API key has been revoked.");
    }

    await apiKey.registerUse(db, { usedAtOrigin: params.usedAtOrigin });

    return apiKey;
  }

  static async revoke(db: Db, params: { publicId: string }): Promise<void> {
    await db
      .collection<ApiKeyDocument>(ApiKey.COLLECTION_NAME)
      .updateMany(
        { publicId: params.publicId, revokedAt: { $eq: null } },
        { $set: { revokedAt: new Date() } },
      );
  }

  isRevoked() {
    return this.revokedAt && this.revokedAt.valueOf() <= new Date().valueOf();
  }

  async registerUse(db: Db, { usedAtOrigin }: { usedAtOrigin?: string } = {}) {
    const { value } = await db
      .collection<ApiKeyDocument>(ApiKey.COLLECTION_NAME)
      .findOneAndUpdate(
        { publicId: this.publicId },
        {
          $inc: { useCount: 1 },
          $set: { lastUsedAt: new Date(), lastUsedOrigin: usedAtOrigin },
        },
        { returnDocument: "after" },
      );

    if (value) {
      this.lastUsedAt = value.lastUsedAt;
      this.lastUsedOrigin = value.lastUsedOrigin;
      this.useCount = value.useCount;
    }
  }
}
