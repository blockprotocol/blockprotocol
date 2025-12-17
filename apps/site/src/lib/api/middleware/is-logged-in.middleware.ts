import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { formatErrors } from "../../../util/api";
import { BaseApiRequest } from "../handler/base-handler";
import { User } from "../model/user.model";

export type IsLoggedInRequestExtensions = {
  user: User;
};

export const isLoggedInMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) => {
  const { user } = req as unknown as BaseApiRequest;

  if (!user) {
    return res.status(401).send(
      formatErrors({
        msg: "You must be logged in to perform this request",
      }),
    );
  }

  return next();
};
