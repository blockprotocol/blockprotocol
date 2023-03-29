import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import dedent from "dedent";
import merge from "lodash/merge";
import { Db, DBRef, ObjectId, WithId } from "mongodb";
import { NextApiResponse } from "next";
import type { Stripe } from "stripe";

import { ApiLoginWithLoginCodeRequestBody } from "../../../pages/api/login-with-login-code.api";
import { getEntityTypes } from "../../../pages/api/types/entity-type/shared/db";
import { ApiVerifyEmailRequestBody } from "../../../pages/api/verify-email.api";
import { SubscriptionTier } from "../../../pages/shared/subscription-utils";
import { formatErrors, RESTRICTED_SHORTNAMES } from "../../../util/api";
import {
  FRONTEND_URL,
  isProduction,
  shouldUseDummyEmailService,
} from "../../config";
import { sendMail } from "../aws-ses";
import { getAllBlocksByUser } from "../blocks/get";
import { sendDummyEmail } from "../dummy-emails";
import { subscribeToMailchimp, updateMailchimpMemberInfo } from "../mailchimp";
import { ApiKey } from "./api-key.model";
import {
  VerificationCode,
  VerificationCodeDocument,
  VerificationCodePropertiesVariant,
  VerificationCodeVariant,
} from "./verification-code.model";

export const ALLOWED_SHORTNAME_CHARS = /^[a-zA-Z0-9-_]+$/;

export type SerializedUser = {
  id: string;
  isSignedUp: boolean;
  email?: string;
  shortname?: string;
  preferredName?: string;
  userAvatarUrl?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: Stripe.Subscription.Status;
  stripeSubscriptionTier: SubscriptionTier;
  canMakeApiServiceCalls?: boolean;
  usageLimitCents?: number;
};

export type UserProperties = {
  email: string;
  hasVerifiedEmail?: boolean;
  shortname?: string;
  preferredName?: string;
  userAvatar?: UserAvatarProperties;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: Stripe.Subscription.Status;
  stripeSubscriptionTier?: SubscriptionTier;
  canMakeApiServiceCalls?: boolean;
  usageLimitCents?: number;
  wordpressInstanceUrls?: string[];
  referrer?: "wordpress" | "blockprotocol";
};

export type UserAvatarProperties = {
  url: string;
  s3Key: string;
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

  userAvatar?: UserAvatarProperties;

  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: Stripe.Subscription.Status;
  stripeSubscriptionTier?: SubscriptionTier;
  canMakeApiServiceCalls?: boolean;
  usageLimitCents?: number;
  wordpressInstanceUrls?: string[];
  referrer: UserProperties["referrer"];

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
    this.userAvatar = args.userAvatar;

    this.stripeCustomerId = args.stripeCustomerId;
    this.stripeSubscriptionId = args.stripeSubscriptionId;
    this.stripeSubscriptionStatus = args.stripeSubscriptionStatus;
    this.stripeSubscriptionTier = args.stripeSubscriptionTier;
    this.canMakeApiServiceCalls = args.canMakeApiServiceCalls;
    this.usageLimitCents = args.usageLimitCents;
    this.wordpressInstanceUrls = args.wordpressInstanceUrls;
    this.referrer = args.referrer;
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
    {
      wordpressInstanceUrl,
      ...params
    }: {
      email: string;
      hasVerifiedEmail: boolean;
      referrer: NonNullable<UserProperties["referrer"]>;
      preferredName?: string;
      shortname?: string;
      wordpressInstanceUrl?: string;
    },
  ): Promise<User> {
    const userProperties: UserProperties = {
      ...params,
      wordpressInstanceUrls: wordpressInstanceUrl ? [wordpressInstanceUrl] : [],
    };

    const { insertedId } = await db
      .collection<Omit<UserDocument, "_id">>(User.COLLECTION_NAME)
      .insertOne(userProperties);

    const { email } = userProperties;

    if (isProduction) {
      await subscribeToMailchimp({ email });
    }

    return new User({ id: insertedId.toString(), ...userProperties });
  }

  static async getEntityTypesByShortname(
    db: Db,
    params: { shortname: string },
  ): Promise<EntityTypeWithMetadata[] | null> {
    const user = await User.getByShortname(db, params);

    return user ? user.entityTypes(db) : null;
  }

  async update(
    db: Db,
    updatedProperties: Partial<UserProperties>,
  ): Promise<User> {
    // Prevent the user from updating their shortname if...
    if (
      this.shortname && // ...the user already has a shortname, and...
      updatedProperties.shortname && // ...the user is trying to update the shortname, and...
      updatedProperties.shortname !== this.shortname // ...the updated shortname is different from the user's original shortname.
    ) {
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

  async addWordpressInstanceUrlAndVerify(
    db: Db,
    wordpressInstanceUrl: string,
    updateReferrer = false,
  ) {
    return await this.update(db, {
      ...(this.wordpressInstanceUrls?.includes(wordpressInstanceUrl)
        ? {}
        : {
            wordpressInstanceUrls: [
              ...(this.wordpressInstanceUrls ?? []),
              wordpressInstanceUrl,
            ],
          }),
      ...(updateReferrer ? { referrer: "wordpress" } : {}),
      hasVerifiedEmail: true,
    });
  }

  isSignedUp(): boolean {
    return !!this.shortname && !!this.preferredName;
  }

  async createVerificationCode(
    db: Db,
    params: VerificationCodePropertiesVariant,
  ): Promise<VerificationCode> {
    const verificationCode = await VerificationCode.create(db, {
      ...params,
      user: this,
    });

    return verificationCode;
  }

  async getVerificationCode(
    db: Db,
    params: {
      verificationCodeId: string;
      variant: VerificationCodeVariant | VerificationCodeVariant[];
    },
  ): Promise<VerificationCode | null> {
    const { verificationCodeId, variant } = params;

    const verificationCode = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .findOne({
        user: this.toRef(),
        variant: Array.isArray(variant) ? { $in: variant } : variant,
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

    if (shouldUseDummyEmailService) {
      await sendDummyEmail([
        `Email verification code: ${loginCode.code}`,
        `Magic Link: ${magicLink}`,
      ]);
    } else {
      await sendMail({
        to: this.email,
        subject: "Your Block Protocol verification code",
        html: dedent`
          <p>To log in, copy and paste your verification code or <a href="${magicLink}">click here</a>.</p>
          <code>${loginCode.code}</code>
        `,
      });
    }

    return loginCode;
  }

  async hasExceededEmailVerificationRateLimit(db: Db): Promise<boolean> {
    const numberOfRecentEmailVerificationCodes = await db
      .collection<VerificationCodeDocument>(VerificationCode.COLLECTION_NAME)
      .count({
        user: this.toRef(),
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

    if (shouldUseDummyEmailService) {
      await sendDummyEmail([
        `Email verification code: ${emailVerificationCode.code}`,
        `Magic Link: ${magicLink}`,
      ]);
    } else {
      await sendMail({
        to: this.email,
        subject: "Your Block Protocol verification code",
        html: dedent`
          <p>To verify your email address, copy and paste your verification code or <a href="${magicLink}">click here</a>.</p>
          <code>${emailVerificationCode.code}</code>
        `,
      });
    }

    return emailVerificationCode;
  }

  async sendLinkWordpressCode(
    db: Db,
    wordpressInstanceUrl: string,
  ): Promise<VerificationCode> {
    const emailVerificationCode = await this.createVerificationCode(db, {
      variant: "linkWordpress",
      wordpressInstanceUrl,
    });

    const magicLinkQueryParams: (
      | ApiVerifyEmailRequestBody
      | ApiLoginWithLoginCodeRequestBody
    ) & {
      email: string;
    } = {
      email: this.email,
      userId: this.id,
      verificationCodeId: emailVerificationCode.id,
      code: emailVerificationCode.code,
    };

    const path = this.hasVerifiedEmail ? "login" : "signup";

    const magicLink = `${FRONTEND_URL}/${path}?${new URLSearchParams(
      magicLinkQueryParams,
    ).toString()}`;

    // Doesn't make sense to include the code itself as they won't be on the
    // page to enter the code, as this will be triggered by the Wordpress
    // backend
    if (shouldUseDummyEmailService) {
      await sendDummyEmail([
        `Magic Link to activate Wordpress plugin: ${magicLink}`,
      ]);
    } else {
      await sendMail({
        to: this.email,
        subject: "Activate your Block Protocol Wordpress plugin",
        html: dedent`
          <p>To ${
            this.hasVerifiedEmail
              ? "login to your Block Protocol account"
              : "finish creating your Block Protocol account"
          }, and to link it to your Wordpress instance, <a href="${magicLink}">click here</a>.</p>
          <p><em>Alternatively, you copy the URL and paste it into your browser: ${magicLink}</em></p>
        `,
      });
    }

    return emailVerificationCode;
  }

  async generateApiKey(db: Db, params: { displayName: string }) {
    const { displayName } = params;

    /* @todo allow users to have multiple API keys - remove this once implemented */
    await ApiKey.revokeAll(db, { user: this });

    return await ApiKey.create(db, { displayName, user: this });
  }

  async apiKeys(db: Db) {
    return await ApiKey.getByUser(db, { user: this });
  }

  async entityTypes(db: Db) {
    return (await getEntityTypes(db, { latestOnly: true, user: this })).map(
      (dbRecord) => dbRecord.entityTypeWithMetadata,
    );
  }

  blocks() {
    if (!this.shortname) {
      return []; // user has not completed signup
    }
    return getAllBlocksByUser({ shortname: this.shortname });
  }

  toRef(): DBRef {
    return new DBRef(User.COLLECTION_NAME, new ObjectId(this.id));
  }

  serialize(includePrivateFields: boolean = false): SerializedUser {
    return {
      id: this.id,
      isSignedUp: this.isSignedUp(),
      email: includePrivateFields ? this.email : undefined,
      preferredName: this.preferredName,
      shortname: this.shortname,
      userAvatarUrl: this.userAvatar?.url,
      stripeCustomerId: this.stripeCustomerId,
      stripeSubscriptionId: this.stripeSubscriptionId,
      stripeSubscriptionStatus: this.stripeSubscriptionStatus,
      stripeSubscriptionTier: this.stripeSubscriptionTier ?? "free",
      canMakeApiServiceCalls: this.canMakeApiServiceCalls,
      usageLimitCents: this.usageLimitCents,
    };
  }
}
