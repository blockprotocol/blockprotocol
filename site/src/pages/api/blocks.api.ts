import { query as queryValidator } from "express-validator";
import { formatErrors } from "../../util/api";
import blocksData from "../../../blocks-data.json";
import { createBaseHandler } from "../../lib/handler/baseHandler";
import { ExpandedBlockMetadata as BlockMetadata } from "../../lib/blocks";

const validateApiKey = (apiKey: string | string[] | undefined) => {
  if (!apiKey || typeof apiKey !== "string") {
    return false;
  }
  // @todo add logic to validate API Key
  return true;
};

export type ApiSearchRequestQuery = {
  q: string;
};

export type ApiSearchResponse = {
  results: BlockMetadata[];
};

export default createBaseHandler<null, ApiSearchResponse>()
  .use(queryValidator("q").isString().toLowerCase())
  .get(async (req, res) => {
    const { q: query } = req.query as ApiSearchRequestQuery;
    const apiKey = req.headers["x-api-key"];

    if (!validateApiKey(apiKey)) {
      return res.status(401).json(
        formatErrors({
          msg: "Unauthorized",
        }),
      );
    }

    let data: BlockMetadata[] = blocksData;

    if (query) {
      data = data.filter(
        ({ displayName, variants, author, name }) =>
          [displayName, author, name].some((item) =>
            item?.toLowerCase().includes(query),
          ) ||
          variants?.some((variant) =>
            variant.displayName?.toLowerCase().includes(query),
          ),
      );
    }

    // @todo paginate response

    res.status(200).json({
      results: data,
    });
  });
