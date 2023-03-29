import { body as bodyValidator, validationResult } from "express-validator";

import { createBaseHandler } from "../../lib/api/handler/base-handler";
import { User } from "../../lib/api/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiSignupRequestBody = {
  email: string;
  wordpressInstanceUrl: string;
};

export type ApiSignupResponse = {
  userId: string;
  verificationCodeId: string;
};

export default createBaseHandler<ApiSignupRequestBody, ApiSignupResponse>()
  .use(bodyValidator("email").isEmail().toLowerCase())
  .use(
    bodyValidator("wordpressInstanceUrl").isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      allow_fragments: false,
      allow_query_components: false,
    }),
  )
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, body } = req;
    const { email, wordpressInstanceUrl } = body;

    // We don't set referrer or instanceUrl for existing users until verification for security
    const user =
      (await User.getByEmail(db, {
        email,
        hasVerifiedEmail: true,
      })) ??
      (await User.getByEmail(db, {
        email,
        hasVerifiedEmail: false,
      })) ??
      (await User.create(db, {
        email,
        hasVerifiedEmail: false,
        referrer: "wordpress",
        wordpressInstanceUrl,
      }));

    if (await user.hasExceededEmailVerificationRateLimit(db)) {
      return res.status(403).json(
        formatErrors({
          msg: "You have exceeded the email verification code rate limit",
        }),
      );
    }

    const { id: verificationCodeId } = await user.sendLinkWordpressCode(
      db,
      wordpressInstanceUrl,
    );

    res.status(200).json({ userId: user.id, verificationCodeId });
  });
