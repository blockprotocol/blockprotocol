import { Middleware } from "next-connect";

import { formatErrors } from "../../../util/api";
import { BaseApiRequest, BaseApiResponse } from "../handler/base-handler";
import { User } from "../model/user.model";

export type IsLoggedInRequestExtensions = {
  user: User;
};

export const isLoggedInMiddleware: Middleware<
  BaseApiRequest,
  BaseApiResponse
> = (req, res, next) => {
  const { user } = req;

  if (!user) {
    return res.status(401).send(
      formatErrors({
        msg: "You must be logged in to perform this request",
      }),
    );
  }

  next();
};
