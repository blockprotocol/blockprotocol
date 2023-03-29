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

// @todo don't add wordpress instance until you click on the link
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

    let user = await User.getByEmail(db, {
      email,
      hasVerifiedEmail: true,
    });

    if (user) {
      user = await user.addWordpressInstanceUrl(db, wordpressInstanceUrl);
    } else {
      user = await User.getByEmail(db, {
        email,
        hasVerifiedEmail: false,
      });

      if (user) {
        user = await user.addWordpressInstanceUrl(
          db,
          wordpressInstanceUrl,
          true,
        );
      }
    }

    if (!user) {
      user = await User.create(db, {
        email,
        hasVerifiedEmail: false,
        referrer: "wordpress",
        wordpressInstanceUrl,
      });
    }

    if (await user.hasExceededEmailVerificationRateLimit(db)) {
      return res.status(403).json(
        formatErrors({
          msg: "You have exceeded the email verification code rate limit",
        }),
      );
    }

    const { id: verificationCodeId } =
      await user.sendEmailVerificationCodeForWordpress(
        db,
        wordpressInstanceUrl,
      );

    res.status(200).json({ userId: user.id, verificationCodeId });
  });
