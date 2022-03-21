import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ValidationError } from "express-validator";
import cors from "cors";
import {
  passportMiddleware,
  PassportRequestExtensions,
} from "../middleware/passport.middleware";
import { sessionMiddleware } from "../middleware/session.middleware";
import { dbMiddleware, DbRequestExtensions } from "../middleware/db.middleware";
import { FRONTEND_URL } from "../../config";

export type BaseApiRequest<RequestBody = unknown> = Omit<
  NextApiRequest,
  "body"
> &
  PassportRequestExtensions &
  DbRequestExtensions & {
    body: RequestBody;
  };

type ErrorResponse = {
  errors: Partial<ValidationError>[];
};

export type BaseApiResponse<T = unknown> = NextApiResponse<T | ErrorResponse>;

export const createBaseHandler = <
  RequestBody = unknown,
  Response = any,
>(options?: {
  isPublicApi?: boolean;
}) => {
  const { isPublicApi } = options ?? {};

  return nextConnect<BaseApiRequest<RequestBody>, BaseApiResponse<Response>>()
    .use(cors({ origin: isPublicApi ? "*" : FRONTEND_URL, credentials: true }))
    .use(dbMiddleware)
    .use(sessionMiddleware)
    .use(...passportMiddleware);
};
