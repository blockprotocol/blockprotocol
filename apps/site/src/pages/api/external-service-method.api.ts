import {
  ExternalServiceMethod200Response,
  ExternalServiceMethodRequest,
} from "@local/internal-api-client";
import { AxiosError } from "axios";

import { createApiKeyRequiredHandler } from "../../lib/api/handler/api-key-required-handler";
import { isBillingFeatureFlagEnabled } from "../../lib/config";
import { internalApi } from "../../lib/internal-api-client";
import { formatErrors, mustGetEnvVar } from "../../util/api";

export default createApiKeyRequiredHandler<
  ExternalServiceMethodRequest,
  ExternalServiceMethod200Response
>()
  .use(async (req, res, next) => {
    if (isBillingFeatureFlagEnabled) {
      next();
    } else {
      res.status(401).send(
        formatErrors({
          msg: `The "billing" feature flag must be enabled to perform this request.`,
        }),
      );
    }
  })
  .post(async (req, res) => {
    /**
     * @todo: stop evaluating theses at runtime once the "billing" feature
     * flag is removed.
     */
    const internalApiKey = mustGetEnvVar("INTERNAL_API_KEY");

    const { id: bpUserId } = req.user;

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
      const axiosError = error as AxiosError;

      const { status, data } = axiosError.response ?? {
        status: 500,
        data: { errors: [{ message: "An unknown error occurred." }] },
      };

      res.status(status ?? 500).json(
        formatErrors({
          msg:
            data &&
            typeof data === "object" &&
            "errors" in data &&
            (data.errors as any[])?.[0].message
              ? (data.errors as any[])?.[0].message
              : "An unknown error occurred.",
          code: status.toString(),
        }),
      );
    }
  });
