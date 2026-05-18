import { body as bodyValidator, validationResult } from "express-validator";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { subscribeToMailchimp } from "../../lib/api/mailchimp";
import { formatErrors } from "../../util/api";

export type SignupNotifyRequestBody = {
  email: string;
};

export type SignupNotifyResponse = {
  ok: true;
};

/**
 * Collects email addresses from visitors who want to be notified when the
 * Block Protocol Hub re-opens new account registration. The address is
 * pushed into the same Mailchimp list used by other newsletter sign-ups so
 * the marketing team has a single source of truth.
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

    try {
      await subscribeToMailchimp({
        email: req.body.email,
        merge_fields: {
          SIGNUP_NOTIFY: "Yes",
        },
      });
    } catch {
      return res.status(502).json(
        formatErrors({
          msg: "Could not subscribe email address. Please try again later.",
        }),
      );
    }

    return res.status(200).json({ ok: true });
  })
  .handler(baseHandlerOptions);
