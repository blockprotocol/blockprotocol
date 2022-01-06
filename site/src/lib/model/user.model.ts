import { Db, WithId, ObjectId, DBRef } from "mongodb";
import {
  VerificationCode,
  VerificationCodeDocument,
} from "./verificationCode.model";

export type SerializedUser = {
  id: string;
  shortname: string;
  preferredName: string;
};

export type UserProperties = {
  email: string;
  verifiedEmail?: boolean;
  shortname?: string;
  preferredName?: string;
  loginCodes?: DBRef[];
  emailVerificationCodes?: DBRef[];
};

type UserConstructorArgs = {
  id: string;
} & UserProperties;

export type UserDocument = WithId<UserProperties>;

export class User {
  id: string;

  email: string;

  verifiedEmail: boolean;

  shortname?: string;

  preferredName?: string;

  loginCodes: DBRef[];

  emailVerificationCodes: DBRef[];

  static COLLECTION_NAME = "bp-users";

  // The period of time in milliseconds where the login code rate limit is enforced (5 minutes)
  static LOGIN_CODE_RATE_LIMIT_PERIOD_MS = 5 * 60 * 1000;

  // The number of login codes that can be sent in a login code rate limit period
  static LOGIN_CODE_RATE_LIMIT = 5;

  // The period of time in milliseconds where the email verification code rate limit is enforced (1 hour)
  static EMAIL_VERIFICATION_CODE_RATE_LIMIT_PERIOD_MS = 60 * 60 * 1000;

  // The number of email verification codes that can be sent in a login code rate limit period
  static EMAIL_VERIFICATION_CODE_RATE_LIMIT = 5;

  constructor(args: UserConstructorArgs) {
    this.id = args.id;
    this.preferredName = args.preferredName;
    this.email = args.email;
    this.verifiedEmail = args.verifiedEmail ?? false;
    this.shortname = args.shortname;
    this.loginCodes = args.loginCodes ?? [];
    this.emailVerificationCodes = args.emailVerificationCodes ?? [];
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
    params: { email: string; verifiedEmail: boolean },
  ): Promise<User | null> {
    const { email, verifiedEmail } = params;

    const userDocument = await db
      .collection<UserDocument>(User.COLLECTION_NAME)
      .findOne({
        $and: [{ email }, { verifiedEmail }],
      });

    return userDocument ? User.fromDocument(userDocument) : null;
  }

  static async create(
    db: Db,
    params: {
      email: string;
      verifiedEmail: boolean;
      preferredName?: string;
      shortname?: string;
    },
  ): Promise<User> {
    const userProperties: UserProperties = {
      ...params,
      loginCodes: [],
      emailVerificationCodes: [],
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

  async createEmailVerificationCode(db: Db): Promise<VerificationCode> {
    const emailVerificationCode = await VerificationCode.create(db);

    await db.collection<UserDocument>(User.COLLECTION_NAME).updateOne(
      { _id: new ObjectId(this.id) },
      {
        $push: {
          emailVerificationCodes: emailVerificationCode.toRef(),
        },
      },
    );

    return emailVerificationCode;
  }

  async hasExceededEmailVerificationRateLimit(db: Db): Promise<boolean> {
    const numberOfRecentEmailVerificationCodes = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .count({
        _id: { $in: this.emailVerificationCodes.map(({ oid }) => oid) },
        createdAt: {
          $gt: new Date(
            new Date().getTime() -
              User.EMAIL_VERIFICATION_CODE_RATE_LIMIT_PERIOD_MS,
          ),
        },
      });

    return (
      numberOfRecentEmailVerificationCodes >
      User.EMAIL_VERIFICATION_CODE_RATE_LIMIT - 1
    );
  }

  async sendEmailVerificationCode(db: Db): Promise<VerificationCode> {
    const emailVerificationCode = await this.createEmailVerificationCode(db);

    /** @todo: send email */
    // eslint-disable-next-line no-console
    console.log("Email verification code: ", emailVerificationCode.code);

    return emailVerificationCode;
  }

  serialize(): SerializedUser {
    if (!this.preferredName || !this.shortname) {
      throw new Error("User must be signed up");
    }
    return {
      id: this.id,
      preferredName: this.preferredName,
      shortname: this.shortname,
    };
  }
}
