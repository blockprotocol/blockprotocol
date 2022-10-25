import { NextConnect } from "next-connect";

import { hasValidApiKeyMiddleware } from "../middleware/has-valid-api-key.middleware.js";
import { AuthenticatedApiRequest } from "./authenticated-handler.js";
import { BaseApiResponse, createBaseHandler } from "./base-handler.js";

export const createApiKeyRequiredHandler = <
  RequestBody = unknown,
  Response = unknown,
>(): NextConnect<
  AuthenticatedApiRequest<RequestBody>,
  BaseApiResponse<Response>
> => createBaseHandler({ isPublicApi: true }).use(hasValidApiKeyMiddleware);
