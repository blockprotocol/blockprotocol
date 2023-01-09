import Ajv from "ajv";
import { createBaseHandler } from "../../lib/api/handler/base-handler";
import { getMember, subscribeToMailchimp } from "../../lib/api/mailchimp";

export type VoteApplicationRequestBody = {
  email: string;
  merge_fields: {
    ECO_SANITY?: string;
    ECO_STRAPI?: string;
    ECO_CONFUL?: string;
    ECO_GITHUB?: string;
    ECO_OTHER?: string;
    WISH_EA?: string;
  };
};

const ajv = new Ajv();

const validate = ajv.compile<VoteApplicationRequestBody>({
  type: "object",
  properties: {
    email: { type: "string" },
    merge_fields: {
      type: "object",
      properties: {
        ECO_SANITY: { type: "string", enum: ["Yes", "No"] },
        ECO_STRAPI: { type: "string", enum: ["Yes", "No"] },
        ECO_CONFUL: { type: "string", enum: ["Yes", "No"] },
        ECO_GITHUB: { type: "string", enum: ["Yes", "No"] },
        ECO_OTHER: { type: "string", enum: ["Yes", "No"] },
        WISH_EA: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  required: ["email"],
  additionalProperties: false,
});

export type VoteApplicationResponse = {
  success?: boolean;
  error?: boolean;
};

export default createBaseHandler<
  VoteApplicationRequestBody,
  VoteApplicationResponse
>().put(async (req, res) => {
  const member = await getMember({ email: req.body.email });

  try {
    const payload = { ...req.body };

    if (member?.merge_fields?.WISH_EA && payload?.merge_fields?.WISH_EA) {
      payload.merge_fields.WISH_EA = `${member?.merge_fields?.WISH_EA}, ${payload.merge_fields.WISH_EA}`;
    }

    const valid = validate(payload);

    if (!valid) {
      throw new Error();
    }

    await subscribeToMailchimp(payload);

    return res.json({ success: true });
  } catch {
    return res.status(400).send({ error: true });
  }
});
