import { merge } from "lodash";
import { Db, WithId, ObjectId, DBRef } from "mongodb";
import { NextApiResponse } from "next";
import { formatErrors, RESTRICTED_SHORTNAMES } from "../../util/api";
import {
  VerificationCode,
  VerificationCodeDocument,
  VerificationCodeVariant,
} from "./verificationCode.model";
import { ApiLoginWithLoginCodeRequestBody } from "../../pages/api/loginWithLoginCode.api";
import { ApiVerifyEmailRequestBody } from "../../pages/api/verifyEmail.api";
import { FRONTEND_URL, isProduction } from "../config";
import { subscribeToMailchimp, updateMailchimpMemberInfo } from "../mailchimp";

export const ALLOWED_SHORTNAME_CHARS = /^[a-zA-Z0-9-_]+$/;

export type SerializedUser = {
  id: string;
  isSignedUp: boolean;
  email: string;
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
      .findOne({ email, hasVerifiedEmail });

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

    const { email } = userProperties;

    if (isProduction) {
      await subscribeToMailchimp({ email });
    }

    return new User({ id: insertedId.toString(), ...userProperties });
  }

  async update(
    db: Db,
    updatedProperties: Partial<UserProperties>,
  ): Promise<User> {
    if (this.shortname && updatedProperties.shortname !== this.shortname) {
      throw new Error("Cannot update shortname");
    }

    if (
      isProduction &&
      (updatedProperties.shortname || updatedProperties.preferredName)
    ) {
      await updateMailchimpMemberInfo({
        email: this.email,
        merge_fields: {
          SHORTNAME: updatedProperties.shortname,
          PREFNAME: updatedProperties.preferredName,
        },
      });
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
        user: this.toRef(),
        variant,
        _id: new ObjectId(verificationCodeId),
      });

    return verificationCode
      ? VerificationCode.fromDocument(verificationCode)
      : null;
  }

  async hasExceededLoginCodeRateLimit(db: Db): Promise<boolean> {
    const numberOfRecentLoginCodes = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .count({
        user: this.toRef(),
        variant: "login",
        createdAt: {
          $gt: new Date(
            new Date().getTime() - User.LOGIN_CODE_RATE_LIMIT_PERIOD_MS,
          ),
        },
      });

    return numberOfRecentLoginCodes > User.LOGIN_CODE_RATE_LIMIT - 1;
  }

  async sendLoginCode(db: Db): Promise<VerificationCode> {
    const loginCode = await this.createVerificationCode(db, {
      variant: "login",
    });

    const magicLinkQueryParams: ApiLoginWithLoginCodeRequestBody & {
      email: string;
    } = {
      email: this.email,
      userId: this.id,
      verificationCodeId: loginCode.id,
      code: loginCode.code,
    };

    const magicLink = `${FRONTEND_URL}/login?${new URLSearchParams(
      magicLinkQueryParams,
    ).toString()}`;

    /** @todo: send email */
    // eslint-disable-next-line no-console
    console.log("Login code: ", loginCode.code);
    // eslint-disable-next-line no-console
    console.log("Magic link: ", magicLink);

    return loginCode;
  }

  async hasExceededEmailVerificationRateLimit(db: Db): Promise<boolean> {
    const numberOfRecentEmailVerificationCodes = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .count({
        user: this.toRef(),
        variant: "login",
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
    const emailVerificationCode = await this.createVerificationCode(db, {
      variant: "email",
    });

    const magicLinkQueryParams: ApiVerifyEmailRequestBody & {
      email: string;
    } = {
      email: this.email,
      userId: this.id,
      verificationCodeId: emailVerificationCode.id,
      code: emailVerificationCode.code,
    };

    const magicLink = `${FRONTEND_URL}/signup?${new URLSearchParams(
      magicLinkQueryParams,
    ).toString()}`;

    /** @todo: send email */
    // eslint-disable-next-line no-console
    console.log("Email verification code: ", emailVerificationCode.code);
    // eslint-disable-next-line no-console
    console.log("Magic Link: ", magicLink);

    return emailVerificationCode;
  }

  toRef(): DBRef {
    return new DBRef(User.COLLECTION_NAME, new ObjectId(this.id));
  }

  serialize(): SerializedUser {
    return {
      id: this.id,
      isSignedUp: this.isSignedUp(),
      email: this.email,
      preferredName: this.preferredName,
      shortname: this.shortname,
    };
  }
}
