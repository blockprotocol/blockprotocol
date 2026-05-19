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
    response: NextApiResponse<ErrorResponse>,
  ): Promise<void> => {
    // eslint-disable-next-line no-console
    console.error(
      `[next-connect] No matching route for ${request.method} ${request.url}`,
    );
    // Don't echo `request.method` / `request.url` back to the client — both are
    // attacker-controlled and reflecting them into the response body is a
    // reflected-XSS sink (CodeQL js/reflected-xss). The diagnostic info above
    // is already logged server-side, which is where it belongs.
    response.status(404).json({ errors: [{ msg: "Route not found" }] });
  },
  onError: async (
    error: unknown,
    _request: NextApiRequest,
    response: NextApiResponse<ErrorResponse>,
  ): Promise<void> => {
    Sentry.captureException(error);
    await Sentry.flush(2000);

    // eslint-disable-next-line no-console
    console.error(error);
    response.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  },
};
