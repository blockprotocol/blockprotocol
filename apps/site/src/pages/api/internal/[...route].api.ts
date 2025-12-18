import httpProxyMiddleware from "next-http-proxy-middleware";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../lib/api/handler/base-handler";
import { isBillingFeatureFlagEnabled } from "../../../lib/config";
import { formatErrors, mustGetEnvVar } from "../../../util/api";

export default createBaseHandler()
  .use((_, res, next) => {
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
  .use((req, res) => {
    const bpUserId = req.user?.id;

    /**
     * @todo: stop evaluating theses at runtime once the "billing" feature
     * flag is removed.
     */
    const internalApiBaseUrl =
      process.env.INTERNAL_API_BASE_URL ?? "http://localhost:5001";

    const internalApiKey = mustGetEnvVar("INTERNAL_API_KEY");

    return httpProxyMiddleware(req, res, {
      headers: {
        "internal-api-key": internalApiKey,
        ...(bpUserId ? { "bp-user-id": bpUserId } : {}),
      },
      changeOrigin: true,
      target: internalApiBaseUrl,
      pathRewrite: [
        {
          patternStr: "^/api/internal",
          replaceStr: "/",
        },
      ],
    });
  })
  .handler(baseHandlerOptions);
