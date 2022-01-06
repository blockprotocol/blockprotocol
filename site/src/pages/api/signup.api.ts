import { body as bodyValidator, validationResult } from "express-validator";
import { createBaseHandler } from "../../lib/handler/baseHandler";
import { User } from "../../lib/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiSignupRequestBody = {
  email: string;
};

export type ApiSignupResponse = {
  userId: string;
  emailVerificationCodeId: string;
};

export default createBaseHandler<ApiSignupRequestBody, ApiSignupResponse>()
  .use(bodyValidator("email").isEmail())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, body } = req;
    const { email } = body;

    const existingUser = await User.getByEmail(db, {
      email,
      verifiedEmail: true,
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
      (await User.getByEmail(db, { email, verifiedEmail: false })) ||
      (await User.create(db, {
        email,
        verifiedEmail: false,
      }));

    if (await user.hasExceededEmailVerificationRateLimit(db)) {
      return res.status(403).json(
        formatErrors({
          msg: "You have exceeded the email verification code rate limit",
        }),
      );
    }

    const { id: emailVerificationCodeId } =
      await user.sendEmailVerificationCode(db);

    res.status(200).json({ userId: user.id, emailVerificationCodeId });
  });
