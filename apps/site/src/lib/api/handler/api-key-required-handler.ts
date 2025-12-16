import { NextHandler } from "next-connect";

import { hasValidApiKeyMiddleware } from "../middleware/has-valid-api-key.middleware";
import { AuthenticatedApiRequest } from "./authenticated-handler";
import { BaseApiResponse, createBaseHandler } from "./base-handler";

type ApiKeyRequiredRequestExtensions = {
  allowCookieFallback?: boolean;
};

export type ApiKeyRequiredRequest<RequestBody = unknown> =
  AuthenticatedApiRequest<RequestBody> & ApiKeyRequiredRequestExtensions;

export const createApiKeyRequiredHandler = <
  RequestBody = unknown,
  Response = unknown,
>(options?: {
  allowCookieFallback?: boolean;
}) =>
  createBaseHandler<RequestBody, Response>({ isPublicApi: true })
    .use(
      async (
        req: ApiKeyRequiredRequest<RequestBody>,
        _res: BaseApiResponse<Response>,
        next: NextHandler,
      ) => {
        if (options?.allowCookieFallback) {
          req.allowCookieFallback = true;
        }
        return next();
      },
    )
    .use(hasValidApiKeyMiddleware);
