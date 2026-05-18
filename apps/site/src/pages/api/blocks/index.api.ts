import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../lib/api/handler/base-handler";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { formatErrors } from "../../../util/api";

export type ApiBlockSearchQuery = {
  author?: string;
  json?: string;
  license?: string;
  name?: string;
  q?: string;
};

export type ApiBlockSearchResponse = {
  results: ExpandedBlockMetadata[];
};

/**
 * The block search endpoint used to be served from MongoDB and required a
 * Block Protocol API key. The Hub publishing pipeline is paused while we
 * focus on HASH, so the route now always replies with a structured error so
 * existing consumers (WordPress plugin, `npx block-template`, etc.) get a
 * clear, machine-readable signal.
 */
export default createBaseHandler<null, ApiBlockSearchResponse>({
  isPublicApi: true,
})
  .get((_req, res) => {
    res.status(503).json(
      formatErrors({
        msg: "The Block Protocol Hub publishing API is paused while we focus on HASH.",
      }),
    );
  })
  .handler(baseHandlerOptions);
