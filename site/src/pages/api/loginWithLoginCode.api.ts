import { body as bodyValidator, validationResult } from "express-validator";
import { createBaseHandler } from "../../lib/api/handler/baseHandler";
import { SerializedUser, User } from "../../lib/api/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiLoginWithLoginCodeRequestBody = {
  userId: string;
  verificationCodeId: string;
  code: string;
};

export type ApiLoginWithLoginCodeResponse = {
  user: SerializedUser;
};

export default createBaseHandler<
  ApiLoginWithLoginCodeRequestBody,
  ApiLoginWithLoginCodeResponse
>()
  .use(
    bodyValidator("userId").isString(),
    bodyValidator("verificationCodeId").isString(),
    bodyValidator("code").isString(),
  )
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { body, db } = req;

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

    const { verificationCodeId, code } = body;

    const loginCode = await user.getVerificationCode(db, {
      verificationCodeId,
      variant: "login",
    });

    if (!loginCode) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find login code associated with user",
          param: "verificationCodeId",
          value: verificationCodeId,
        }),
      );
    }

    if (loginCode.validate(res, { errorPrefix: "Login" })) {
      if (loginCode.code !== code) {
        await loginCode.incrementAttempts(db);

        return res.status(403).json(
          formatErrors({
            msg: "Login code is incorrect",
            param: "code",
            value: code,
          }),
        );
      }

      await loginCode.setToUsed(db);

      req.login(user, () =>
        res.status(200).json({
          user: user.serialize(true),
        }),
      );
    }
  });
