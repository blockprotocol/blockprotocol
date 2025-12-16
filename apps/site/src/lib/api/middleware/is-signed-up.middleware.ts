import { NextHandler } from "next-connect";

import { formatErrors } from "../../../util/api";
import { AuthenticatedApiRequest } from "../handler/authenticated-handler";
import { BaseApiResponse } from "../handler/base-handler";

export const isSignedUpMiddleware = (
  req: AuthenticatedApiRequest,
  res: BaseApiResponse,
  next: NextHandler,
) => {
  const { user } = req;

  if (!user.isSignedUp()) {
    return res.status(403).json(
      formatErrors({
        code: "SIGNUP_INCOMPLETE",
        msg: "You must be signed up to perform this request",
      }),
    );
  }

  return next();
};
