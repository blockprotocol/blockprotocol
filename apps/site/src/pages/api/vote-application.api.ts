import * as Sentry from "@sentry/nextjs";
import Ajv from "ajv";

import { ApplicationId } from "../../components/pages/wordpress/voting/applications";
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

export type VoteApplicationRequestBody = {
  email: string;
  vote: ApplicationId;
  other?: string;
};

export type VoteApplicationResponse = {
  success?: boolean;
  error?: boolean;
};

// Human-readable application name keyed by the legacy Mailchimp merge-field
// id. We keep the same wire format on the request (so the WordPress voting
// component can carry on sending `ECO_*` identifiers) but expose the
// normalised name to Customer.io segments / campaigns instead.
const APPLICATION_LABEL: Record<ApplicationId, string> = {
  ECO_SANITY: "sanity",
  ECO_STRAPI: "strapi",
  ECO_CONFUL: "contentful",
  ECO_DRUPAL: "drupal",
  ECO_OTHER: "other",
};

const ajv = new Ajv();

const validate = ajv.compile<VoteApplicationRequestBody>({
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    vote: {
      type: "string",
      enum: ["ECO_SANITY", "ECO_STRAPI", "ECO_CONFUL", "ECO_DRUPAL", "ECO_OTHER"],
    },
    other: { type: "string" },
  },
  required: ["email", "vote"],
  additionalProperties: false,
});

/**
 * Records a vote cast on the `/wordpress` "which CMS should we support
 * next?" widget. Used to be a Mailchimp PUT that toggled a boolean merge
 * field per CMS and concatenated free-text suggestions into `WISH_EA`.
 *
 * In Customer.io we model votes as discrete events instead — every cast
 * vote produces an `application_voted` event with the application id /
 * label / suggestion as properties. Segments built on top of the event
 * stream naturally give you the same "which users voted for which CMS"
 * roll-up that the old merge-field flags did, but without losing the
 * history of repeat votes.
 */
export default createBaseHandler<
  VoteApplicationRequestBody,
  VoteApplicationResponse
>()
  .put(async (req, res) => {
    if (!validate(req.body)) {
      return res.status(400).json({ error: true });
    }

    if (!isConfigured()) {
      return res.status(200).json({ success: true });
    }

    const { email, vote, other } = req.body;
    const ip = extractRemoteIp(req.headers, req.socket?.remoteAddress);
    const applicationLabel = APPLICATION_LABEL[vote];

    try {
      await identifyPerson({
        userId: email,
        traits: {
          email,
          signup_source: "blockprotocol.org",
          signup_location: "/wordpress",
          // Track the most recent vote on the person record itself so
          // single-user campaigns ("thanks for voting for X") can branch
          // off the trait without consulting the event stream.
          last_application_vote: applicationLabel,
          ...(other ? { last_application_suggestion: other } : {}),
        },
        ip,
      });

      await trackEvent({
        userId: email,
        event: "application_voted",
        properties: {
          application: applicationLabel,
          application_id: vote,
          ...(other ? { suggestion: other } : {}),
        },
        ip,
      });
    } catch (error) {
      Sentry.captureException(error);
      // eslint-disable-next-line no-console -- surfaces in Vercel logs
      console.error("[vote-application] Customer.io error:", error);
      return res.status(502).json({ error: true });
    }

    return res.status(200).json({ success: true });
  })
  .handler(baseHandlerOptions);
