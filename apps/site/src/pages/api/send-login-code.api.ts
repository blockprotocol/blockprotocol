import { body as bodyValidator, validationResult } from "express-validator";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { ensureUserIsMailchimpMember } from "../../lib/api/mailchimp";
import { User } from "../../lib/api/model/user.model";
import { isProduction } from "../../lib/config";
import { formatErrors } from "../../util/api";

export type ApiSendLoginCodeRequestBody = {
  email: string;
};

export type ApiSendLoginCodeResponse = {
  userId: string;
  verificationCodeId: string;
};

export default createBaseHandler<
  ApiSendLoginCodeRequestBody,
  ApiSendLoginCodeResponse
>()
  .use(bodyValidator("email").isEmail().toLowerCase())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { body, db } = req;

    const { email } = body;

    const user = await User.getByEmail(db, { email, hasVerifiedEmail: true });

    if (!user) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find user with the provided email",
          value: email,
        }),
      );
    }

    if (await user.hasExceededLoginCodeRateLimit(db)) {
      return res.status(403).json(
        formatErrors({
          msg: `Please wait ${
            User.LOGIN_CODE_RATE_LIMIT_PERIOD_MS / 1000 / 60
          } minutes and try again`,
        }),
      );
    }

    const [{ id: verificationCodeId }] = await Promise.all([
      user.sendLoginCode(db),
      isProduction ? ensureUserIsMailchimpMember({ user }) : undefined,
    ]);

    res.status(200).json({
      userId: user.id,
      verificationCodeId,
    });
  })
  .handler(baseHandlerOptions);
