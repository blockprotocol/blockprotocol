import {
  body as bodyValidator,
  oneOf as oneOfValidator,
  validationResult,
} from "express-validator";

import { createAuthenticatedHandler } from "../../lib/api/handler/authenticated-handler";
import { SerializedUser } from "../../lib/api/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiSetUsageLimitRequestBody =
  | { limit: "capped"; usageLimitCents: number }
  | { limit: "uncapped" };

export type ApiSetUsageLimitResponse = {
  user: SerializedUser;
};

export default createAuthenticatedHandler<
  ApiSetUsageLimitRequestBody,
  ApiSetUsageLimitResponse
>()
  .use(
    oneOfValidator(
      [
        [
          bodyValidator("limit").isString().equals("capped"),
          bodyValidator("usageLimitCents").isInt().notEmpty(),
        ],
        bodyValidator("limit").isString().equals("uncapped"),
      ],
      "You must specify either a capped or uncapped usage limit",
    ),
  )
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { user, db, body } = req;
    const { limit } = body;

    await user.update(db, {
      usageLimitCents: limit === "capped" ? body.usageLimitCents : undefined,
    });

    res.status(200).json({ user: user.serialize(true) });
  });
