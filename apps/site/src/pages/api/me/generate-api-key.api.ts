import { validationResult } from "express-validator";
import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders";

import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../util/api";

export type ApiGenerateApiKeyBody = {
  displayName: string;
};

export type ApiGenerateApiKeyResponse = {
  apiKey: string;
};

export default createAuthenticatedHandler<
  ApiGenerateApiKeyBody,
  ApiGenerateApiKeyResponse
>()
  .use(bodyValidator("displayName").isString().notEmpty())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, user } = req;

    // user is guaranteed to exist by isLoggedInMiddleware
    if (!user) {
      return res.status(401).json({ apiKey: null });
    }

    const { displayName } = req.body;

    const apiKey = await user.generateApiKey(db, { displayName });

    res.status(200).json({ apiKey });
  })
  .handler(baseHandlerOptions);
