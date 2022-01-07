import { body as bodyValidator, validationResult } from "express-validator";
import { createBaseHandler } from "../../lib/handler/baseHandler";
import { SerializedUser, User } from "../../lib/model/user.model";
import { formatErrors } from "../../util/api";

export type LoginWithLoginCodeRequestBody = {
  userId: string;
  loginCodeId: string;
  code: string;
};

export type LoginWithLoginCodeResponse = {
  user: SerializedUser;
};

export default createBaseHandler<
  LoginWithLoginCodeRequestBody,
  LoginWithLoginCodeResponse
>()
  .use(
    bodyValidator("userId").isString(),
    bodyValidator("loginCodeId").isString(),
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

    const { loginCodeId, code } = body;

    const loginCode = await user.getLoginCode(db, { loginCodeId });

    if (!loginCode) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find login code associated with user",
          param: "loginCodeId",
          value: loginCodeId,
        }),
      );
    } else if (loginCode.hasBeenUsed()) {
      return res.status(403).json(
        formatErrors({
          msg: "Login code has already been used",
        }),
      );
    } else if (loginCode.hasExceededMaximumAttempts()) {
      return res.status(403).json(
        formatErrors({
          msg: "Login code has been used too many times",
        }),
      );
    } else if (loginCode.hasExpired()) {
      return res.status(403).json(
        formatErrors({
          msg: "Login code has expired",
        }),
      );
    } else if (loginCode.code !== code) {
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

    const response: LoginWithLoginCodeResponse = {
      user: user.serialize(),
    };

    req.login(user, () => res.status(200).json(response));
  });
