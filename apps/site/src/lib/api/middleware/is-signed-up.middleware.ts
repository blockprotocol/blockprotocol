import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { formatErrors } from "../../../util/api";
import { AuthenticatedApiRequest } from "../handler/authenticated-handler";

export const isSignedUpMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) => {
  const { user } = req as unknown as AuthenticatedApiRequest;

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
