import { NextConnect } from "next-connect";

import { hasValidApiKeyMiddleware } from "../middleware/has-valid-api-key.middleware";
import {
  BaseApiRequest,
  BaseApiResponse,
  createBaseHandler,
} from "./base-handler";

export const createApiKeyRequiredHandler = <
  RequestBody = unknown,
  Response = unknown,
>(): NextConnect<BaseApiRequest<RequestBody>, BaseApiResponse<Response>> =>
  createBaseHandler({ isPublicApi: true }).use(hasValidApiKeyMiddleware);
