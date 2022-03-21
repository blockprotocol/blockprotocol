import { NextConnect } from "next-connect";
import {
  BaseApiRequest,
  BaseApiResponse,
  createBaseHandler,
} from "./baseHandler";
import { hasValidApiKeyMiddleware } from "../middleware/hasValidApiKey.middleware";

export const createApiKeyRequiredHandler = <
  RequestBody = unknown,
  Response = unknown,
>(): NextConnect<BaseApiRequest<RequestBody>, BaseApiResponse<Response>> =>
  createBaseHandler({ isPublicApi: true }).use(hasValidApiKeyMiddleware);
