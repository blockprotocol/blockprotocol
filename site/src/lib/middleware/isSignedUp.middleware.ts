import { Middleware } from "next-connect";
import { BaseApiResponse } from "../handler/baseHandler";
import { formatErrors } from "../../util/api";
import { AuthenticatedApiRequest } from "../handler/authenticatedHandler";

export const isSignedUpMiddleware: Middleware<
  AuthenticatedApiRequest,
  BaseApiResponse
> = (req, res, next) => {
  const { user } = req;

  if (!user.isSignedUp()) {
    return res.status(403).json(
      formatErrors({
        msg: "You must be signed up to perform this request",
      }),
    );
  }

  next();
};
