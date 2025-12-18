import * as Sentry from "@sentry/nextjs";
import cors from "cors";
import { ValidationError } from "express-validator";
import { Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper, NextHandler } from "next-connect";
import nextSession from "next-session";

import { FRONTEND_URL } from "../../config";
import { dbMiddleware, DbRequestExtensions } from "../middleware/db.middleware";
import {
  passportMiddleware,
  PassportRequestExtensions,
} from "../middleware/passport.middleware";
import { sessionMiddleware } from "../middleware/session.middleware";
import { User } from "../model/user.model";

// Extend NextApiRequest globally to include our middleware extensions
declare module "next" {
  interface NextApiRequest {
    db: Db;
    user?: User;
    session?: Awaited<ReturnType<ReturnType<typeof nextSession>>>;
    login(user: User, done: (err: unknown) => void): void;
    login(user: User, options: unknown, done: (err: unknown) => void): void;
    logout(done: (err: unknown) => void): void;
  }
}

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

// Use NextApiRequest/NextApiResponse for router to satisfy IncomingMessage constraint,
// then cast the result to use proper extended types for handlers
export const createBaseHandler = <
  RequestBody = unknown,
  Response = any,
>(options?: {
  isPublicApi?: boolean;
}) => {
  const { isPublicApi } = options ?? {};

  return (
    createRouter<NextApiRequest, NextApiResponse>()
      .use(async (req, res, next) => {
        // For server-to-server requests (no origin), skip CORS entirely
        const origin = req.headers.origin;
        if (!origin) {
          return next();
        }

        // For browser requests, use the cors middleware
        return new Promise<void>((resolve, reject) => {
          cors({
            origin: isPublicApi ? "*" : FRONTEND_URL,
            credentials: true,
          })(req, res, (err?: unknown) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }).then(() => next());
      })
      .use(dbMiddleware)
      .use(sessionMiddleware)
      /**
       * Manually set `req.session.regenerate` and `req.session.save` to prevent error
       * in `passport`. This should be removed once an alternative solution is available.
       *
       * @see https://github.com/jaredhanson/passport/issues/904
       */
      .use(async (req, _res, next) => {
        const baseReq = req as unknown as BaseApiRequest<RequestBody>;
        if (baseReq.session && !baseReq.session.regenerate) {
          baseReq.session.regenerate = (cb: () => any) => cb();
        }
        if (baseReq.session && !baseReq.session.save) {
          baseReq.session.save = (cb: () => any) => cb();
        }
        return next();
      })
      .use(expressWrapper(passportMiddleware[0]!))
      .use(expressWrapper(passportMiddleware[1]!))
  );
};

export const baseHandlerOptions = {
  onNoMatch: async (
    request: NextApiRequest,
    response: NextApiResponse,
  ): Promise<void> => {
    // eslint-disable-next-line no-console
    console.error(
      `[next-connect] No matching route for ${request.method} ${request.url}`,
    );
    response.statusCode = 404;
    response.end(`Route ${request.method} ${request.url} not found`);
  },
  onError: async (
    error: unknown,
    _request: NextApiRequest,
    response: NextApiResponse,
  ): Promise<void> => {
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
};
