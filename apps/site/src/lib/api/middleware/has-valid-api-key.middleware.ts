import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { formatErrors } from "../../../util/api";
import { parseClientIp } from "../../../util/usage";
import { ApiKeyRequiredRequest } from "../handler/api-key-required-handler";
import { ApiKey } from "../model/api-key.model";
import { User } from "../model/user.model";

export const hasValidApiKeyMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) => {
  const apiKeyReq = req as unknown as ApiKeyRequiredRequest;
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || typeof apiKey !== "string") {
      if (apiKeyReq.allowCookieFallback && apiKeyReq.user) {
        return next();
      }

      return res.status(401).send(
        formatErrors({
          msg: "A valid API key must be provided in a 'x-api-key' header.",
        }),
      );
    }

    const { db } = apiKeyReq;

    const resolvedApiKey = await ApiKey.validateAndGet(db, {
      apiKeyString: apiKey,
      usedAtOrigin: req.headers.origin ?? parseClientIp(apiKeyReq) ?? undefined,
    });

    const user = await User.getById(db, {
      userId: resolvedApiKey.user.oid.toString(),
    });

    if (!user) {
      return res.status(401).send(
        formatErrors({
          msg: "User linked to API key does not exist.",
        }),
      );
    }

    apiKeyReq.user = user;

    return next();
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
