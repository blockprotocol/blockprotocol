import { body as bodyValidator, validationResult } from "express-validator";
import { createAuthenticatedHandler } from "../../lib/api/handler/authenticatedHandler";
import { SerializedUser, User } from "../../lib/api/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiCompleteSignupRequestBody = {
  shortname: string;
  preferredName: string;
};

export type ApiCompleteSignupResponse = {
  user: SerializedUser;
};

export default createAuthenticatedHandler<
  ApiCompleteSignupRequestBody,
  ApiCompleteSignupResponse
>(false)
  .use(
    bodyValidator("shortname").isString().notEmpty().toLowerCase(),
    bodyValidator("preferredName").isString().notEmpty(),
  )
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, user, body } = req;

    const { shortname, preferredName } = body;

    if (user.shortname && user.shortname !== shortname) {
      return res.status(400).json(
        formatErrors({
          msg: "Cannot update shortname of user",
          param: "shortname",
          value: shortname,
        }),
      );
    }
    if (await User.validateShortname(db, shortname, res)) {
      await user.update(db, { shortname, preferredName });

      res.status(200).json({ user: user.serialize(true) });
    }
  });
