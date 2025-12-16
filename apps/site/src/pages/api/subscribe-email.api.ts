import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
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
>()
  .put(async (req, res) => {
    return await subscribeToMailchimp(req.body)
      .then(() => {
        return res.json({ success: true });
      })
      .catch(() => {
        return res.status(400).send({ error: true });
      });
  })
  .handler(baseHandlerOptions);
