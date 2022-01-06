import { Db, WithId, ObjectId, DBRef } from "mongodb";
import {
  VerificationCode,
  VerificationCodeDocument,
} from "./verificationCode.model";

export type SerializedUser = {
  id: string;
  preferredName: string;
};

export type UserProperties = {
  preferredName: string;
  email: string;
  loginCodes: DBRef[];
};

type UserConstructorArgs = {
  id: string;
} & UserProperties;

type UserDocument = WithId<UserProperties>;

export class User {
  id: string;

  preferredName: string;

  email: string;

  loginCodes: DBRef[];

  static COLLECTION_NAME = "bp-users";

  // The period of time in milliseconds where the login code rate limit is enforced (5 minutes)
  static LOGIN_CODE_RATE_LIMIT_PERIOD_MS = 5 * 60 * 1000;

  // The number of login codes that can be sent in a login code rate limit period
  static LOGIN_CODE_RATE_LIMIT = 5;

  constructor({ id, preferredName, email, loginCodes }: UserConstructorArgs) {
    this.id = id;
    this.preferredName = preferredName;
    this.loginCodes = loginCodes;
    this.email = email;
  }

  private static fromDocument({ _id, ...remainingDocument }: UserDocument) {
    return new User({
      id: _id.toString(),
      ...remainingDocument,
    });
  }

  static async getById(
    db: Db,
    params: { userId: string },
  ): Promise<User | null> {
    const { userId } = params;
    const userDocument = await db
      .collection<UserDocument>(this.COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId) });

    return userDocument ? User.fromDocument(userDocument) : null;
  }

  static async getByEmail(
    db: Db,
    params: { email: string },
  ): Promise<User | null> {
    const { email } = params;

    const userDocument = await db
      .collection<UserDocument>(User.COLLECTION_NAME)
      .findOne({ email });

    return userDocument ? User.fromDocument(userDocument) : null;
  }

  static async create(
    db: Db,
    params: { preferredName: string; email: string },
  ): Promise<User> {
    const userProperties: UserProperties = {
      ...params,
      loginCodes: [],
    };

    const { insertedId } = await db
      .collection<UserDocument>(User.COLLECTION_NAME)
      .insertOne(userProperties);

    return new User({ id: insertedId.toString(), ...userProperties });
  }

  async createLoginCode(db: Db): Promise<VerificationCode> {
    const loginCode = await VerificationCode.create(db);

    await db.collection<UserDocument>(User.COLLECTION_NAME).updateOne(
      { _id: new ObjectId(this.id) },
      {
        $push: {
          loginCodes: loginCode.toRef(),
        },
      },
    );

    return loginCode;
  }

  async getLoginCode(
    db: Db,
    params: { loginCodeId: string },
  ): Promise<VerificationCode | null> {
    if (
      !this.loginCodes.find(({ oid }) => oid.toString() === params.loginCodeId)
    ) {
      return null;
    }

    const loginCode = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .findOne({
        $and: [
          {
            _id: { $in: this.loginCodes.map(({ oid }) => oid) },
          },
          {
            _id: new ObjectId(params.loginCodeId),
          },
        ],
      });

    return loginCode ? VerificationCode.fromDocument(loginCode) : null;
  }

  async hasExceededLoginCodeRateLimit(db: Db): Promise<boolean> {
    const numberOfRecentLoginCodes = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .count({
        _id: { $in: this.loginCodes.map(({ oid }) => oid) },
        createdAt: {
          $gt: new Date(
            new Date().getTime() - User.LOGIN_CODE_RATE_LIMIT_PERIOD_MS,
          ),
        },
      });

    return numberOfRecentLoginCodes > User.LOGIN_CODE_RATE_LIMIT - 1;
  }

  async sendLoginCode(db: Db): Promise<VerificationCode> {
    const loginCode = await this.createLoginCode(db);

    /** @todo: send email */
    // eslint-disable-next-line no-console
    console.log("Login code: ", loginCode.code);

    return loginCode;
  }

  serialize(): SerializedUser {
    return { id: this.id, preferredName: this.preferredName };
  }
}
