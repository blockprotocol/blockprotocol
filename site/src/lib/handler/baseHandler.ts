import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ValidationError } from "express-validator";
import {
  passportMiddleware,
  PassportRequestExtensions,
} from "../middleware/passport.middleware";
import { sessionMiddleware } from "../middleware/session.middleware";
import { dbMiddleware, DbRequestExtensions } from "../middleware/db.middleware";

export type BaseApiRequest<RequestBody = any> = Omit<NextApiRequest, "body"> &
  PassportRequestExtensions &
  DbRequestExtensions & {
    body: RequestBody;
  };

type ErrorResponse = {
  errors: Partial<ValidationError>[];
};

export type BaseApiResponse<T = any> = NextApiResponse<T | ErrorResponse>;

export const createBaseHandler = <RequestBody = any, Response = any>() =>
  nextConnect<BaseApiRequest<RequestBody>, BaseApiResponse<Response>>()
    .use(dbMiddleware)
    .use(sessionMiddleware)
    .use(...passportMiddleware);
