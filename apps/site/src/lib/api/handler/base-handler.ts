import * as Sentry from "@sentry/nextjs";
import cors from "cors";
import { ValidationError } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nextSession from "next-session";

import { FRONTEND_URL } from "../../config";
import { dbMiddleware, DbRequestExtensions } from "../middleware/db.middleware";
import {
  passportMiddleware,
  PassportRequestExtensions,
} from "../middleware/passport.middleware";
import { sessionMiddleware } from "../middleware/session.middleware";

export type BaseApiRequest<RequestBody = unknown> = Omit<
  NextApiRequest,
  "body"
> &
  PassportRequestExtensions &
  DbRequestExtensions & {
    body: RequestBody;
    // Session is not exported directly from library, so doing this instead
    session?: Awaited<ReturnType<ReturnType<typeof nextSession>>>;
  };

export type ErrorResponse = {
  errors: Partial<ValidationError & { code?: string }>[];
};

export type BaseApiResponse<T = unknown> = NextApiResponse<T | ErrorResponse>;

export const createBaseHandler = <
  RequestBody = unknown,
  Response = any,
>(options?: {
  isPublicApi?: boolean;
}) => {
  const { isPublicApi } = options ?? {};

  return (
    nextConnect<BaseApiRequest<RequestBody>, BaseApiResponse<Response>>({
      onError: async (error, request, response) => {
        // Source: https://github.com/vercel/next.js/blob/cd3e054f14ce38f4ff57c727a997da2a6e1d05dd/examples/with-sentry/pages/api/test4.js
        Sentry.captureException(error);
        await Sentry.flush(2000);

        // Default next-connect behavior
        // https://github.com/hoangvvo/next-connect/blob/e5ac7faf380a73114a2b6b07b0a43a01f8c1be36/src/node.ts#L125-L127
        response.statusCode = 500;
        // eslint-disable-next-line no-console
        console.error(error);
        response.end("Internal Server Error");
      },
    })
      .use(
        cors({ origin: isPublicApi ? "*" : FRONTEND_URL, credentials: true }),
      )
      .use(dbMiddleware)
      .use(sessionMiddleware)
      /**
       * Manually set `req.session.regenerate` and `req.session.save` to prevent error
       * in `passport`. This should be removed once an alternative solution is available.
       *
       * @see https://github.com/jaredhanson/passport/issues/904
       */
      .use((req, _res, next) => {
        if (req.session && !req.session.regenerate) {
          req.session.regenerate = (cb: () => any) => cb();
        }
        if (req.session && !req.session.save) {
          req.session.save = (cb: () => any) => cb();
        }
        next();
      })
      .use(...passportMiddleware)
  );
};
