import * as Sentry from "@sentry/nextjs";
import cors from "cors";
import { ValidationError } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { FRONTEND_URL } from "../../config";

export type BaseApiRequest<RequestBody = unknown> = Omit<
  NextApiRequest,
  "body"
> & {
  body: RequestBody;
};

export type ErrorResponse = {
  errors: Partial<ValidationError & { code?: string }>[];
};

export type BaseApiResponse<T = unknown> = NextApiResponse<T | ErrorResponse>;

// Use NextApiRequest/NextApiResponse for router to satisfy IncomingMessage constraint,
// then cast the result to use proper extended types for handlers. The
// generic parameters are kept on the public signature so that call sites can
// continue to document the request/response shapes inline, even though they
// aren't referenced inside the implementation.
export const createBaseHandler = <
  _RequestBody = unknown,
  _Response = unknown,
>(options?: {
  isPublicApi?: boolean;
}) => {
  const { isPublicApi } = options ?? {};

  return createRouter<NextApiRequest, NextApiResponse>().use(
    async (req, res, next) => {
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
    },
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
    Sentry.captureException(error);
    await Sentry.flush(2000);

    response.statusCode = 500;
    // eslint-disable-next-line no-console
    console.error(error);
    response.end("Internal Server Error");
  },
};
