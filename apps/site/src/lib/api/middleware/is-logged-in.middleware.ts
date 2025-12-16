import { NextHandler } from "next-connect";

import { formatErrors } from "../../../util/api";
import { BaseApiRequest, BaseApiResponse } from "../handler/base-handler";
import { User } from "../model/user.model";

export type IsLoggedInRequestExtensions = {
  user: User;
};

export const isLoggedInMiddleware = (
  req: BaseApiRequest,
  res: BaseApiResponse,
  next: NextHandler,
) => {
  const { user } = req;

  if (!user) {
    return res.status(401).send(
      formatErrors({
        msg: "You must be logged in to perform this request",
      }),
    );
  }

  return next();
};
