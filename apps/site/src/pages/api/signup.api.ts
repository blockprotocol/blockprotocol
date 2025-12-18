import { body as bodyValidator, validationResult } from "express-validator";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { User } from "../../lib/api/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiSignupRequestBody = {
  email: string;
};

export type ApiSignupResponse = {
  userId: string;
  verificationCodeId: string;
};

export default createBaseHandler<ApiSignupRequestBody, ApiSignupResponse>()
  .use(bodyValidator("email").isEmail().toLowerCase())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, body } = req;
    const { email } = body;

    const existingUser = await User.getByEmail(db, {
      email,
      hasVerifiedEmail: true,
    });

    if (existingUser) {
      return res.status(400).json(
        formatErrors({
          msg: "An existing user is associated with the email address",
          param: "email",
          value: email,
        }),
      );
    }

    const user =
      (await User.getByEmail(db, { email, hasVerifiedEmail: false })) ||
      (await User.create(db, {
        email,
        hasVerifiedEmail: false,
        referrer: "Block Protocol",
      }));

    if (await user.hasExceededEmailVerificationRateLimit(db)) {
      return res.status(403).json(
        formatErrors({
          msg: "You have exceeded the email verification code rate limit",
        }),
      );
    }

    const { id: verificationCodeId } = await user.sendEmailVerificationCode(db);

    res.status(200).json({ userId: user.id, verificationCodeId });
  })
  .handler(baseHandlerOptions);
