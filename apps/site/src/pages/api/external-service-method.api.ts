import {
  ExternalServiceMethod200Response,
  ExternalServiceMethodRequest,
} from "@local/internal-api-client";
import { AxiosError } from "axios";
import { body as bodyValidator, validationResult } from "express-validator";

import { createApiKeyRequiredHandler } from "../../lib/api/handler/api-key-required-handler";
import { baseHandlerOptions } from "../../lib/api/handler/base-handler";
import { isBillingFeatureFlagEnabled } from "../../lib/config";
import { internalApi } from "../../lib/internal-api-client";
import { formatErrors, mustGetEnvVar } from "../../util/api";

const isErrorAxiosError = (error: unknown): error is AxiosError =>
  (error as AxiosError).isAxiosError;

export default createApiKeyRequiredHandler<
  ExternalServiceMethodRequest,
  ExternalServiceMethod200Response
>({
  allowCookieFallback: true,
})
  .use(async (_req, res, next) => {
    if (isBillingFeatureFlagEnabled) {
      return next();
    } else {
      return res.status(401).send(
        formatErrors({
          msg: `The "billing" feature flag must be enabled to perform this request.`,
        }),
      );
    }
  })
  .use(
    bodyValidator("providerName").isString().notEmpty(),
    bodyValidator("methodName").isString().notEmpty(),
    bodyValidator("payload").exists(),
  )
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    /**
     * @todo: stop evaluating theses at runtime once the "billing" feature
     * flag is removed.
     */
    const internalApiKey = mustGetEnvVar("INTERNAL_API_KEY");

    const bpUserId = req.user?.id;

    try {
      const { data } = await internalApi.externalServiceMethod(req.body, {
        headers: {
          "internal-api-key": internalApiKey,
          "bp-user-id": bpUserId,
          // The internal API falls back to the Vercel provided geolocation
          // when it's unable to resolve an IP address location.
          // See https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country
          "x-vercel-ip-country": req.headers["x-vercel-ip-country"],
        },
      });
      res.status(200).json(data);
    } catch (error) {
      let message;
      let status = 500;
      let code = "INTERNAL_ERROR";
      if (isErrorAxiosError(error)) {
        if (error.response?.status) {
          status = error.response.status;
        }
        const { data } = error.response ?? {};
        if (data && typeof data === "object") {
          if ("message" in data && data.message) {
            message = data.message;
          }
          if ("code" in data && typeof data.code === "string") {
            code = data.code;
          }
        } else if (error.message) {
          message = error.message;
        }
      } else if ("message" in (error as Error) && (error as Error).message) {
        message = (error as Error).message;
      }

      res.status(status).json(
        formatErrors({
          ...(isErrorAxiosError(error)
            ? error.response?.data ?? { code }
            : { code }),
          /**
           * For the purposes of backwards compatibility, temporarily continue returning
           * the `msg` alias.
           *
           * @todo update the wordpress plugin to stop using the `msg` alias for `message` when handling errors
           * @see https://app.asana.com/0/1202805690238892/1204117110538079/f
           */
          msg: message,
        }),
      );
    }
  })
  .handler(baseHandlerOptions);
