import crypto from "node:crypto";

import { updateBlockFromNpm } from "../../../lib/api/blocks/npm";
import { createBaseHandler } from "../../../lib/api/handler/base-handler";
import { FRONTEND_URL } from "../../../lib/config";
import { formatErrors } from "../../../util/api";
import { revalidateMultiBlockPages } from "./shared";

type PackageEventName =
  | "star"
  | "unstar"
  | "publish"
  | "unpublish"
  | "owner"
  | "owner-rm"
  | "dist-tag"
  | "dist-tag-rm"
  | "deprecated"
  | "undeprecated"
  | "change";

type PackageChangeObject = {
  "dist-tag": string;
  version: string;
};

/**
 * @see https://github.com/npm/registry/blob/master/docs/hooks/hooks-payload.md
 */
type ApiNpmWebhookBody = {
  change: PackageChangeObject;
  event: `package:${PackageEventName}`;
  hookOwner: { username: string };
  name: string; // package name
  payload: Record<string, unknown>; // API data on the package
  time: string; // unix timestamp in ms
  type: "package";
  version: string;
};

type ApiWebhookResponse = "ok";

export const npmWebhookEndpoint = `${FRONTEND_URL}/api/blocks/npm-hook`;
export const npmWebhookSecret = process.env.NPM_WEBHOOK_SECRET;

export default createBaseHandler<ApiNpmWebhookBody, ApiWebhookResponse>().post(
  async (req, res) => {
    if (!npmWebhookSecret) {
      const errorMsg =
        "No npm webhook secret in environment. Cannot process received webhook message.";
      // eslint-disable-next-line no-console -- server-side, useful for debugging
      console.error(errorMsg);
      res.status(500).send(formatErrors({ msg: errorMsg }));
      return;
    }

    const requestSignature = req.headers["x-npm-signature"];

    const expected = crypto
      .createHmac("sha256", npmWebhookSecret)
      .update(req.body.toString())
      .digest("hex");

    if (requestSignature !== `sha256=${expected}`) {
      const errorMsg = "Request signature does not match expectation.";
      // eslint-disable-next-line no-console -- server-side, useful for debugging
      console.error(errorMsg);
      res.status(400).send(formatErrors({ msg: errorMsg }));
      return;
    }

    const { event, name, change } = req.body;
    if (event !== "package:publish" || change["dist-tag"] !== "latest") {
      return;
    }

    try {
      const { expandedMetadata } = await updateBlockFromNpm({
        npmPackageName: name,
        version: change.version,
      });
      await revalidateMultiBlockPages(res, expandedMetadata.author);
      await res.revalidate(expandedMetadata.blockSitePath);
      res.status(200).send("ok");
    } catch (err) {
      // eslint-disable-next-line no-console -- server-side, useful for debugging
      console.error(`Could not update block from npm: ${err}`);
    }
  },
);
