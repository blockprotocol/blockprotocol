import {
  isLoggedInMiddleware,
  IsLoggedInRequestExtensions,
} from "../middleware/is-logged-in.middleware";
import { isSignedUpMiddleware } from "../middleware/is-signed-up.middleware";
import {
  BaseApiRequest,
  BaseApiResponse,
  createBaseHandler,
} from "./base-handler";

export type AuthenticatedApiRequest<RequestBody = unknown> =
  BaseApiRequest<RequestBody> & IsLoggedInRequestExtensions;

export const createAuthenticatedHandler = <
  RequestBody = unknown,
  Response = unknown,
>(
  isSignedUp: boolean = true,
) => {
  const handler = createBaseHandler<RequestBody, Response>().use(
    isLoggedInMiddleware,
  );

  if (isSignedUp) {
    return handler.use(isSignedUpMiddleware);
  }

  return handler;
};
