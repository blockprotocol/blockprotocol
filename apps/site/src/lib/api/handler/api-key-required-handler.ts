import { NextConnect } from "next-connect";

import { hasValidApiKeyMiddleware } from "../middleware/has-valid-api-key.middleware";
import { AuthenticatedApiRequest } from "./authenticated-handler";
import { BaseApiResponse, createBaseHandler } from "./base-handler";

export const createApiKeyRequiredHandler = <
  RequestBody = unknown,
  Response = unknown,
>(): NextConnect<
  AuthenticatedApiRequest<RequestBody>,
  BaseApiResponse<Response>
> => createBaseHandler({ isPublicApi: true }).use(hasValidApiKeyMiddleware);
