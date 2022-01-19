import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders";
import { validationResult } from "express-validator";

import { createAuthenticatedHandler } from "../../../lib/handler/authenticatedHandler";
import { formatErrors } from "../../../util/api";

type GenerateApiKeyBody = {
  displayName: string;
};

export type GenerateApiKeyResponse = {
  apiKey: string;
};

export default createAuthenticatedHandler<
  GenerateApiKeyBody,
  GenerateApiKeyResponse
>(false)
  .use(bodyValidator("displayName").isString().notEmpty())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, user } = req;

    const { displayName } = req.body;

    const apiKey = await user.generateApiKey(db, { displayName });

    res.status(200).json({ apiKey });
  });
