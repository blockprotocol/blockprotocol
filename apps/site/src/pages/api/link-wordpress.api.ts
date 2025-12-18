import { body as bodyValidator, validationResult } from "express-validator";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { User } from "../../lib/api/model/user.model";
import { formatErrors } from "../../util/api";

type ApiLinkWordPressRequestBody = {
  email: string;
  wordpressInstanceUrl: string;
  wordpressSettingsUrl: string;
};

type ApiLinkWordPressResponse = {
  userId: string;
  verificationCodeId: string;
};

export default createBaseHandler<
  ApiLinkWordPressRequestBody,
  ApiLinkWordPressResponse
>()
  .use(bodyValidator("email").isEmail().toLowerCase())
  .use(
    bodyValidator("wordpressInstanceUrl").isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_tld: process.env.NODE_ENV === "production",
      allow_fragments: false,
      allow_query_components: false,
    }),
  )
  .use(
    bodyValidator("wordpressSettingsUrl").isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_tld: process.env.NODE_ENV === "production",
      allow_fragments: false,
      allow_query_components: true,
    }),
  )
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, body } = req;
    const { email, wordpressInstanceUrl, wordpressSettingsUrl } = body;

    // We don't set referrer or instanceUrl for existing users until verification for security
    const user =
      (await User.getByEmail(db, {
        email,
        verifiedAndNonVerified: true,
      })) ??
      (await User.create(db, {
        email,
        hasVerifiedEmail: false,
        referrer: "WordPress",
        wordpressInstanceUrl,
      }));

    if (await user.hasExceededEmailVerificationRateLimit(db)) {
      return res.status(403).json(
        formatErrors({
          msg: "You have exceeded the email verification code rate limit",
        }),
      );
    }

    const { id: verificationCodeId } = await user.sendLinkWordPressCode(db, {
      instance: wordpressInstanceUrl,
      settings: wordpressSettingsUrl,
    });

    res.status(200).json({ userId: user.id, verificationCodeId });
  })
  .handler(baseHandlerOptions);
