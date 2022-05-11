import { Middleware } from "next-connect";

import { formatErrors } from "../../../util/api";
import { BaseApiRequest, BaseApiResponse } from "../handler/base-handler";
import { ApiKey } from "../model/api-key.model";

export const hasValidApiKeyMiddleware: Middleware<
  BaseApiRequest,
  BaseApiResponse
> = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || typeof apiKey !== "string") {
      return res.status(401).send(
        formatErrors({
          msg: "A valid API key must be provided in a 'x-api-key' header.",
        }),
      );
    }

    const { db } = req;

    await ApiKey.validate(db, { apiKeyString: apiKey });

    next();
  } catch (err) {
    return res.status(401).send(
      formatErrors({
        msg:
          err instanceof Error
            ? err.message
            : "Unknown error validating API key.",
      }),
    );
  }
};
