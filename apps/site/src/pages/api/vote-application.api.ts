import { createBaseHandler } from "../../lib/api/handler/base-handler";
import { getMember, subscribeToMailchimp } from "../../lib/api/mailchimp";

export type VoteApplicationRequestBody = {
  email: string;
  merge_fields?: { [key: string]: any };
};

export type VoteApplicationResponse = {
  success?: boolean;
  error?: boolean;
};

export default createBaseHandler<
  VoteApplicationRequestBody,
  VoteApplicationResponse
>().put(async (req, res) => {
  try {
    const member = await getMember({ email: req.body.email });

    const payload = {
      email: req.body.email,
      merge_fields: req.body.merge_fields,
    };
    if (member?.merge_fields?.WISH_EA && payload?.merge_fields?.WISH_EA) {
      payload.merge_fields.WISH_EA = `${member?.merge_fields?.WISH_EA}, ${payload.merge_fields.WISH_EA}`;
    }

    await subscribeToMailchimp(payload);

    return res.json({ success: true });
  } catch {
    return res.status(400).send({ error: true });
  }
});
