import { Middleware } from "next-connect";

import { formatErrors } from "../../../util/api.js";
import { BaseApiRequest, BaseApiResponse } from "../handler/base-handler.js";
import { User } from "../model/user.model.js";

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
