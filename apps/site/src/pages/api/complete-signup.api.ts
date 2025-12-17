import { body as bodyValidator, validationResult } from "express-validator";

import { createAuthenticatedHandler } from "../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../lib/api/handler/base-handler";
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

    // user is guaranteed to exist by isLoggedInMiddleware
    if (!user) {
      return res.status(401).json(formatErrors({ msg: "Unauthorized" }));
    }

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
  })
  .handler(baseHandlerOptions);
