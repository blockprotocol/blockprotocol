import { body as bodyValidator, validationResult } from "express-validator";

import { createAuthenticatedHandler } from "../../lib/api/handler/authenticated-handler";
import { SerializedUser } from "../../lib/api/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiUpdateUserPreferredNameRequestBody = {
  preferredName: string;
};

export type ApiUpdateUserPreferredNameResponse = {
  user: SerializedUser;
};

export default createAuthenticatedHandler<
  ApiUpdateUserPreferredNameRequestBody,
  ApiUpdateUserPreferredNameResponse
>()
  .use(bodyValidator("preferredName").isString().notEmpty())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, body, user } = req;
    const { preferredName } = body;

    try {
      await user.update(db, {
        preferredName,
      });

      res.status(200).json({ user: user.serialize(true) });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json(
          formatErrors({
            msg: error.message,
          }),
        );
      } else {
        res.status(400).json(
          formatErrors({
            msg: "Unknown error while trying to update preferred name.",
          }),
        );
      }
    }
  });
