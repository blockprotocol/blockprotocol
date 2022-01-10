import { merge } from "lodash";
import { Db, WithId, ObjectId, DBRef } from "mongodb";
import { NextApiResponse } from "next";
import { formatErrors, RESTRICTED_SHORTNAMES } from "../../util/api";
import {
  VerificationCode,
  VerificationCodeDocument,
  VerificationCodeVariant,
} from "./verificationCode.model";

export const ALLOWED_SHORTNAME_CHARS = /^[a-zA-Z0-9-_]+$/;

export type SerializedUser = {
  id: string;
  isSignedUp: boolean;
  shortname?: string;
  preferredName?: string;
};

export type UserProperties = {
  email: string;
  hasVerifiedEmail?: boolean;
  shortname?: string;
  preferredName?: string;
};

type UserConstructorArgs = {
  id: string;
} & UserProperties;

export type UserDocument = WithId<UserProperties>;

export class User {
  id: string;

  email: string;

  hasVerifiedEmail: boolean;

  shortname?: string;

  preferredName?: string;

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
    this.hasVerifiedEmail = args.hasVerifiedEmail ?? false;
    this.shortname = args.shortname;
  }

  private static isShortnameReserved(shortname: string): boolean {
    return RESTRICTED_SHORTNAMES.includes(shortname);
  }

  static async isShortnameTaken(db: Db, shortname: string): Promise<boolean> {
    return (
      User.isShortnameReserved(shortname) ||
      !!(await User.getByShortname(db, { shortname }))
    );
  }

  static async validateShortname(
    db: Db,
    shortname: string,
    res: NextApiResponse,
  ): Promise<boolean> {
    if (shortname.search(ALLOWED_SHORTNAME_CHARS)) {
      res.status(400).json(
        formatErrors({
          msg: "Shortname may only contain letters, numbers, - or _",
          param: "shortname",
          value: shortname,
        }),
      );
      return false;
    } else if (shortname[0] === "-") {
      res.status(400).json(
        formatErrors({
          msg: "Shortname cannot start with '-'",
          param: "shortname",
          value: shortname,
        }),
      );
      return false;
    } else if (await User.isShortnameTaken(db, shortname)) {
      res.status(400).json(
        formatErrors({
          msg: `Shortname ${shortname} taken`,
          param: "shortname",
          value: shortname,
        }),
      );
      return false;
    } else if (shortname.length < 4) {
      res.status(400).json(
        formatErrors({
          msg: "Shortname must be at least 4 characters long.",
          param: "shortname",
          value: shortname,
        }),
      );
      return false;
    } else if (shortname.length > 24) {
      res.status(400).json(
        formatErrors({
          msg: "Shortname cannot be longer than 24 characters",
          param: "shortname",
          value: shortname,
        }),
      );
      return false;
    }
    return true;
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
    params: { email: string; hasVerifiedEmail: boolean },
  ): Promise<User | null> {
    const { email, hasVerifiedEmail } = params;

    const userDocument = await db
      .collection<UserDocument>(User.COLLECTION_NAME)
      .findOne({
        $and: [{ email }, { hasVerifiedEmail }],
      });

    return userDocument ? User.fromDocument(userDocument) : null;
  }

  static async getByShortname(
    db: Db,
    params: { shortname: string },
  ): Promise<User | null> {
    const { shortname } = params;

    const userDocument = await db
      .collection<UserDocument>(User.COLLECTION_NAME)
      .findOne({ shortname });

    return userDocument ? User.fromDocument(userDocument) : null;
  }

  static async create(
    db: Db,
    params: {
      email: string;
      hasVerifiedEmail: boolean;
      preferredName?: string;
      shortname?: string;
    },
  ): Promise<User> {
    const userProperties: UserProperties = {
      ...params,
    };

    const { insertedId } = await db
      .collection<UserDocument>(User.COLLECTION_NAME)
      .insertOne(userProperties);

    /** @todo: add to mailchimp mailing list */

    return new User({ id: insertedId.toString(), ...userProperties });
  }

  async update(
    db: Db,
    updatedProperties: Partial<UserProperties>,
  ): Promise<User> {
    if (this.shortname && updatedProperties.shortname !== this.shortname) {
      throw new Error("Cannot update shortname");
    }

    await db
      .collection<UserDocument>(User.COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(this.id) }, { $set: updatedProperties });

    merge(this, updatedProperties);

    return this;
  }

  isSignedUp(): boolean {
    return !!this.shortname && !!this.preferredName;
  }

  async createVerificationCode(
    db: Db,
    params: { variant: VerificationCodeVariant },
  ): Promise<VerificationCode> {
    const { variant } = params;

    const verificationCode = await VerificationCode.create(db, {
      variant,
      user: this,
    });

    return verificationCode;
  }

  async getVerificationCode(
    db: Db,
    params: { verificationCodeId: string; variant: VerificationCodeVariant },
  ): Promise<VerificationCode | null> {
    const { verificationCodeId, variant } = params;

    const verificationCode = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .findOne({
        $and: [
          {
            user: this.toRef(),
          },
          {
            variant,
          },
          {
            _id: new ObjectId(verificationCodeId),
          },
        ],
      });

    return verificationCode
      ? VerificationCode.fromDocument(verificationCode)
      : null;
  }

  async hasExceededLoginCodeRateLimit(db: Db): Promise<boolean> {
    const numberOfRecentLoginCodes = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .count({
        $and: [
          {
            user: this.toRef(),
          },
          {
            variant: "login",
          },
          {
            createdAt: {
              $gt: new Date(
                new Date().getTime() - User.LOGIN_CODE_RATE_LIMIT_PERIOD_MS,
              ),
            },
          },
        ],
      });

    return numberOfRecentLoginCodes > User.LOGIN_CODE_RATE_LIMIT - 1;
  }

  async sendLoginCode(db: Db): Promise<VerificationCode> {
    const loginCode = await this.createVerificationCode(db, {
      variant: "login",
    });

    /** @todo: send email */
    // eslint-disable-next-line no-console
    console.log("Login code: ", loginCode.code);

    return loginCode;
  }

  async hasExceededEmailVerificationRateLimit(db: Db): Promise<boolean> {
    const numberOfRecentEmailVerificationCodes = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .count({
        $and: [
          {
            user: this.toRef(),
          },
          {
            variant: "login",
          },
          {
            createdAt: {
              $gt: new Date(
                new Date().getTime() -
                  User.EMAIL_VERIFICATION_CODE_RATE_LIMIT_PERIOD_MS,
              ),
            },
          },
        ],
      });

    return (
      numberOfRecentEmailVerificationCodes >
      User.EMAIL_VERIFICATION_CODE_RATE_LIMIT - 1
    );
  }

  async sendEmailVerificationCode(db: Db): Promise<VerificationCode> {
    const emailVerificationCode = await this.createVerificationCode(db, {
      variant: "email",
    });

    /** @todo: send email */
    // eslint-disable-next-line no-console
    console.log("Email verification code: ", emailVerificationCode.code);

    return emailVerificationCode;
  }

  toRef(): DBRef {
    return new DBRef(User.COLLECTION_NAME, new ObjectId(this.id));
  }

  serialize(): SerializedUser {
    return {
      id: this.id,
      isSignedUp: true,
      preferredName: this.preferredName,
      shortname: this.shortname,
    };
  }
}
