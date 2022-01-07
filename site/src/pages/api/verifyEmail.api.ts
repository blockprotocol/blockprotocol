import { body as bodyValidator, validationResult } from "express-validator";
import { createBaseHandler } from "../../lib/handler/baseHandler";
import { SerializedUser, User } from "../../lib/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiVerifyEmailRequestBody = {
  userId: string;
  emailVerificationCodeId: string;
  code: string;
};

export type ApiVerifyEmailResponse = {
  user: SerializedUser;
};

export default createBaseHandler<
  ApiVerifyEmailRequestBody,
  ApiVerifyEmailResponse
>()
  .use(
    bodyValidator("userId").isString().notEmpty(),
    bodyValidator("emailVerificationCodeId").isString().notEmpty(),
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
          value: userId,
        }),
      );
    }

    const { emailVerificationCodeId, code } = body;

    const emailVerificaitonCode = await user.getVerificationCode(db, {
      verificationCodeId: emailVerificationCodeId,
      variant: "email",
    });

    if (!emailVerificaitonCode) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find email verification code associated with user",
          param: "emailVerificaitonCode",
          value: emailVerificaitonCode,
        }),
      );
    }

    if (
      emailVerificaitonCode.validate(res, {
        errorPrefix: "Email verification",
      })
    ) {
      if (emailVerificaitonCode.code !== code) {
        await emailVerificaitonCode.incrementAttempts(db);

        return res.status(403).json(
          formatErrors({
            msg: "Login code is incorrect",
            param: "code",
            value: code,
          }),
        );
      }

      req.login(user, () => res.status(200).json({ user: user.serialize() }));
    }
  });
