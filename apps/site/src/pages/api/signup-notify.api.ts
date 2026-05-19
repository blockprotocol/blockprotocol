import * as Sentry from "@sentry/nextjs";
import { body as bodyValidator, validationResult } from "express-validator";

import {
  extractRemoteIp,
  identifyPerson,
  isConfigured,
  trackEvent,
} from "../../lib/api/customerio";
import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { formatErrors } from "../../util/api";

export type SignupNotifyRequestBody = {
  email: string;
  referrer?: string;
  signupLocation?: string;
};

export type SignupNotifyResponse = {
  ok: true;
};

/**
 * Collects email addresses from visitors who want to be notified when the
 * Block Protocol Hub re-opens new account registration. The waitlist used
 * to live in Mailchimp; we now push the address into the same Customer.io
 * workspace that powers all hash.ai sign-ups so the marketing team has a
 * single source of truth across both properties.
 *
 * The route fires two CDP calls per successful submission:
 *
 * 1. `identify` — sets persistent traits on the person record
 *    (`signup_source: "blockprotocol.org"`, `signup_location`, and the
 *    HTTP `Referer` if present). Re-submissions are idempotent: Customer.io
 *    merges traits onto the existing person keyed by `userId` (the email).
 * 2. `track` event `waitlist_joined` — lets campaigns / segments react to
 *    the join itself rather than just inspecting the trait set.
 *
 * If `CUSTOMERIO_API_KEY` is unset (local dev, preview deploys without
 * secrets) the route short-circuits to a 200 — there is no upstream to
 * call, and we don't want previews / e2e tests to fail just because the
 * marketing pipeline isn't wired up.
 */
export default createBaseHandler<
  SignupNotifyRequestBody,
  SignupNotifyResponse
>()
  .use(bodyValidator("email").isEmail().toLowerCase())
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    if (!isConfigured()) {
      return res.status(200).json({ ok: true });
    }

    const { email, referrer, signupLocation } = req.body;
    const ip = extractRemoteIp(req.headers, req.socket?.remoteAddress);

    try {
      await identifyPerson({
        userId: email,
        traits: {
          email,
          signup_source: "blockprotocol.org",
          ...(signupLocation ? { signup_location: signupLocation } : {}),
          ...(referrer ? { referrer } : {}),
        },
        ip,
      });

      await trackEvent({
        userId: email,
        event: "waitlist_joined",
        properties: {
          signup_source: "blockprotocol.org",
          ...(signupLocation ? { signup_location: signupLocation } : {}),
        },
        ip,
      });
    } catch (error) {
      Sentry.captureException(error);
      // eslint-disable-next-line no-console -- surfaces in Vercel logs
      console.error("[signup-notify] Customer.io error:", error);
      return res.status(502).json(
        formatErrors({
          msg: "Could not subscribe email address. Please try again later.",
        }),
      );
    }

    return res.status(200).json({ ok: true });
  })
  .handler(baseHandlerOptions);
