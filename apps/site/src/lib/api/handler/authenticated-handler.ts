import { NextConnect } from "next-connect";

import {
  isLoggedInMiddleware,
  IsLoggedInRequestExtensions,
} from "../middleware/is-logged-in.middleware.js";
import { isSignedUpMiddleware } from "../middleware/is-signed-up.middleware.js";
import {
  BaseApiRequest,
  BaseApiResponse,
  createBaseHandler,
} from "./base-handler.js";

export type AuthenticatedApiRequest<RequestBody = unknown> =
  BaseApiRequest<RequestBody> & IsLoggedInRequestExtensions;

export const createAuthenticatedHandler = <
  RequestBody = unknown,
  Response = unknown,
>(
  isSignedUp: boolean = true,
): NextConnect<
  AuthenticatedApiRequest<RequestBody>,
  BaseApiResponse<Response>
> =>
  createBaseHandler().use(
    ...[isLoggedInMiddleware, isSignedUp ? isSignedUpMiddleware : []].flat(),
  );
