import { NextConnect } from "next-connect";
import { User } from "../model/user.model";
import {
  BaseApiRequest,
  BaseApiResponse,
  createBaseHandler,
} from "./baseHandler";

type AuthenticatedApiRequest<RequestBody = any> =
  BaseApiRequest<RequestBody> & {
    user: User;
  };

export const createAuthenticatedHandler = <
  RequestBody = any,
  Response = any,
>(): NextConnect<
  AuthenticatedApiRequest<RequestBody>,
  BaseApiResponse<Response>
> =>
  createBaseHandler().use((req, res, next) => {
    if (!req.user) {
      res.status(401).send("Unauthorized");
    }
    next();
  });
