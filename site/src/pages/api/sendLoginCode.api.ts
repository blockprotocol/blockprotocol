import { body as bodyValidator, validationResult } from "express-validator";
import { createBaseHandler } from "../../lib/handler/baseHandler";
import { User } from "../../lib/model/user.model";
import { formatErrors } from "../../util/api";

export type SendLoginCodeRequestBody = {
  email: string;
};

export type SendLoginCodeResponse = {
  userId: string;
  loginCodeId: string;
};

export default createBaseHandler<
  SendLoginCodeRequestBody,
  SendLoginCodeResponse
>()
  .use(bodyValidator("email").isEmail().toLowerCase())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { body, db } = req;

    const { email } = body;

    const user = await User.getByEmail(db, { email });

    if (!user) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find user with the provided email",
          value: email,
        }),
      );
    }

    const loginCode = await user.sendLoginCode(db);

    res.status(200).json({
      userId: user.id,
      loginCodeId: loginCode.id,
    });
  });
