import { NextConnect } from "next-connect";

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
}): NextConnect<
  ApiKeyRequiredRequest<RequestBody>,
  BaseApiResponse<Response>
> =>
  createBaseHandler({ isPublicApi: true })
    .use<ApiKeyRequiredRequest<RequestBody>, BaseApiResponse<Response>>(
      (req, _res, next) => {
        if (options?.allowCookieFallback) {
          req.allowCookieFallback = true;
        }
        next();
      },
    )
    .use(hasValidApiKeyMiddleware);
