import { createApiKeyRequiredHandler } from "../../lib/handler/apiKeyRequiredHandler";

export type ApiMeResponse = {
  results: "OK";
};

/** @todo replace this with the real search API */
export default createApiKeyRequiredHandler<undefined, ApiMeResponse>().get(
  (req, res) => {
    res.status(200).json({ results: "OK" });
  },
);
