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

export type SubscribeEmailRequestBody = {
  email: string;
  referrer?: string;
  signupLocation?: string;
};

export type SubscribeEmailResponse = {
  success?: boolean;
  error?: boolean;
};

/**
 * Captures emails from the "Get early access" CTA on the WordPress plugin
 * landing page (`/wordpress`). Historically these were dropped into a
 * Mailchimp list with a `ECO_WP: "Yes"` merge field; the new behaviour is
 * to identify the person against Customer.io and fire a
 * `wordpress_plugin_interest_recorded` event so marketing automations can
 * trigger off the event in the same way they do for hash.ai sign-ups.
 *
 * Returns `{ success: true }` to keep the existing client-side contract
 * (see `api-client.ts > subscribeEmailWP`) — the WordPress CTA component
 * only checks for that boolean.
 */
export default createBaseHandler<
  SubscribeEmailRequestBody,
  SubscribeEmailResponse
>()
  .use(bodyValidator("email").isEmail().toLowerCase())
  .put(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true });
    }

    if (!isConfigured()) {
      // No Customer.io credentials in this environment — treat the call as
      // a no-op success so non-prod environments don't break the CTA.
      return res.status(200).json({ success: true });
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
        event: "wordpress_plugin_interest_recorded",
        properties: {
          signup_source: "blockprotocol.org",
          ...(signupLocation ? { signup_location: signupLocation } : {}),
        },
        ip,
      });
    } catch (error) {
      Sentry.captureException(error);
      // eslint-disable-next-line no-console -- surfaces in Vercel logs
      console.error("[subscribe-email] Customer.io error:", error);
      return res.status(502).json({ error: true });
    }

    return res.status(200).json({ success: true });
  })
  .handler(baseHandlerOptions);
