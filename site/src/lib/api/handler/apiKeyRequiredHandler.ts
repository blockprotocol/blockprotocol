import { NextConnect } from "next-connect";

import { hasValidApiKeyMiddleware } from "../middleware/hasValidApiKey.middleware";
import {
  BaseApiRequest,
  BaseApiResponse,
  createBaseHandler,
} from "./baseHandler";

export const createApiKeyRequiredHandler = <
  RequestBody = unknown,
  Response = unknown,
>(): NextConnect<BaseApiRequest<RequestBody>, BaseApiResponse<Response>> =>
  createBaseHandler({ isPublicApi: true }).use(hasValidApiKeyMiddleware);
