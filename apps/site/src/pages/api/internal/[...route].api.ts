import httpProxyMiddleware from "next-http-proxy-middleware";

import { createBaseHandler } from "../../../lib/api/handler/base-handler";
import { mustGetEnvVar } from "../../../util/api";

const internalApiBaseUrl = mustGetEnvVar("INTERNAL_API_BASE_URL");

const internalApiKey = mustGetEnvVar("INTERNAL_API_KEY");

export default createBaseHandler().use((req, res) => {
  const bpUserId = req.user?.id;

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
});
