import { NextConnect } from "next-connect";
import {
  isLoggedInMiddleware,
  IsLoggedInRequestExtensions,
} from "../middleware/isLoggedIn.middleware";
import { isSignedUpMiddleware } from "../middleware/isSignedUp.middleware";
import {
  BaseApiRequest,
  BaseApiResponse,
  createBaseHandler,
} from "./baseHandler";

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
