import { validationResult } from "express-validator";
import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders";

import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import { formatErrors } from "../../../util/api";

export type ApiRevokeApiKeyBody = {
  publicId: string;
};

export type ApiRevokeApiKeyResponse = {};

export default createAuthenticatedHandler<
  ApiRevokeApiKeyBody,
  ApiRevokeApiKeyResponse
>(false)
  .use(bodyValidator("publicId").isString().notEmpty())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, user } = req;

    const { publicId } = req.body;

    const revoked = await user.revokeApiKey(db, { publicId });

    if (!revoked) {
      return res.status(400).json(
        formatErrors({
          msg: "Could not revoke the API key. It may have already been revoked.",
          value: publicId,
        }),
      );
    }

    res.status(200).json({});
  });
