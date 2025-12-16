import { validationResult } from "express-validator";
import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders";

import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../lib/api/handler/base-handler";
import { ApiKey } from "../../../lib/api/model/api-key.model";
import { formatErrors } from "../../../util/api";

export type ApiRevokeApiKeyBody = {
  publicId: string;
};

export type ApiRevokeApiKeyResponse = "SUCCESS";

export default createAuthenticatedHandler<
  ApiRevokeApiKeyBody,
  ApiRevokeApiKeyResponse
>()
  .use(bodyValidator("publicId").isString().notEmpty())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, user } = req;

    const { publicId } = req.body;

    const { found, revoked } = await ApiKey.revokeByUser(db, {
      publicId,
      user,
    });

    if (!found || !revoked) {
      return res.status(400).json(
        formatErrors({
          msg: "Could not revoke the API key. It may have already been revoked.",
          value: publicId,
        }),
      );
    }

    res.status(200).json("SUCCESS");
  })
  .handler(baseHandlerOptions);
