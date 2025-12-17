import { hasValidApiKeyMiddleware } from "../middleware/has-valid-api-key.middleware";
import { AuthenticatedApiRequest } from "./authenticated-handler";
import { createBaseHandler } from "./base-handler";

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
    .use(async (req, _res, next) => {
      if (options?.allowCookieFallback) {
        (req as unknown as ApiKeyRequiredRequest<RequestBody>).allowCookieFallback =
          true;
      }
      return next();
    })
    .use(hasValidApiKeyMiddleware);
