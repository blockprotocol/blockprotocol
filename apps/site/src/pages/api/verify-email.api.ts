import { body as bodyValidator, validationResult } from "express-validator";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { SerializedUser, User } from "../../lib/api/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiVerifyEmailRequestBody = {
  userId: string;
  verificationCodeId: string;
  code: string;
};

export type ApiVerifyEmailResponse = {
  user: SerializedUser;
  redirectPath?: string;
  wordpressSettingsUrl?: string;
};

export default createBaseHandler<
  ApiVerifyEmailRequestBody,
  ApiVerifyEmailResponse
>()
  .use(
    bodyValidator("userId").isString().notEmpty(),
    bodyValidator("verificationCodeId").isString().notEmpty(),
    bodyValidator("code").isString().notEmpty(),
  )
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, body } = req;
    const { userId } = body;

    const user = await User.getById(db, { userId });

    if (!user) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find user with the provided id",
          param: "userId",
          value: userId,
        }),
      );
    }

    if (user.hasVerifiedEmail) {
      return res.status(400).json(
        formatErrors({
          msg: "User has already been verified",
          param: "userId",
          value: userId,
        }),
      );
    }

    const { verificationCodeId, code } = body;

    const emailVerificationCode = await user.getVerificationCode(db, {
      verificationCodeId,
      variant: ["email", "linkWordPress"],
    });

    if (!emailVerificationCode) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find email verification code associated with user",
          param: "verificationCodeId",
          value: verificationCodeId,
        }),
      );
    }

    if (
      emailVerificationCode.validate(res, {
        errorPrefix: "Email verification",
      })
    ) {
      if (emailVerificationCode.code !== code) {
        await emailVerificationCode.incrementAttempts(db);

        return res.status(403).json(
          formatErrors({
            msg: "Login code is incorrect",
            param: "code",
            value: code,
          }),
        );
      }

      if (emailVerificationCode.variant === "linkWordPress") {
        const wordpressInstanceUrl =
          emailVerificationCode?.wordpressUrls?.instance;
        if (!wordpressInstanceUrl) {
          return res.status(500).json(
            formatErrors({
              msg: "Internal error. Please try again.",
              param: "code",
              value: code,
            }),
          );
        }

        await emailVerificationCode.setToUsed(db);
        await user.addWordPressInstanceUrlAndVerify(db, {
          wordpressInstanceUrl,
          updateReferrer: true,
        });
      } else {
        await emailVerificationCode.setToUsed(db);
        await user.update(db, { hasVerifiedEmail: true });
      }

      req.login(user, () =>
        res.status(200).json({
          user: user.serialize(true),
          ...(emailVerificationCode.variant === "linkWordPress"
            ? {
                redirectPath: "/dashboard",
                wordpressSettingsUrl:
                  emailVerificationCode.wordpressUrls?.settings,
              }
            : {}),
        }),
      );
    }
  })
  .handler(baseHandlerOptions);
