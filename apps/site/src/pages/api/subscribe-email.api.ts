import { createBaseHandler } from "../../lib/api/handler/base-handler";
import { subscribeToMailchimp } from "../../lib/api/mailchimp";

export type SubscribeEmailRequestBody = {
  email: string;
  merge_fields?: { [key: string]: any };
};

export type SubscribeEmailResponse = {
  success?: boolean;
  error?: boolean;
};

export default createBaseHandler<
  SubscribeEmailRequestBody,
  SubscribeEmailResponse
>().put(async (req, res) => {
  try {
    await subscribeToMailchimp(req.body);
  } catch (err) {
    return res.status(400).send({ error: true });
  }

  return res.json({ success: true });
});
