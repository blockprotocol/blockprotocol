import { validationResult } from "express-validator";
import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders";

import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../lib/api/handler/base-handler";
import { ApiKey } from "../../../lib/api/model/api-key.model";
import { formatErrors } from "../../../util/api";

export type ApiUpdateApiKeyBody = {
  publicId: string;
  displayName: string;
};

export type ApiUpdateApiKeyResponse = "SUCCESS";

export default createAuthenticatedHandler<
  ApiUpdateApiKeyBody,
  ApiUpdateApiKeyResponse
>()
  .use(bodyValidator("publicId").isString().notEmpty())
  .use(bodyValidator("displayName").isString().notEmpty())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, user } = req;

    // user is guaranteed to exist by isLoggedInMiddleware
    if (!user) {
      return res.status(401).json("SUCCESS");
    }

    const { publicId, displayName } = req.body;

    const { found } = await ApiKey.updateByUser(db, {
      publicId,
      user,
      displayName,
    });

    if (!found) {
      return res.status(400).json(
        formatErrors({
          msg: "Could not update the API key. Perhaps it doesn't exist.",
          value: publicId,
        }),
      );
    }
    // If it was found but not updated, the operation was a no-op.

    res.status(200).json("SUCCESS");
  })
  .handler(baseHandlerOptions);
