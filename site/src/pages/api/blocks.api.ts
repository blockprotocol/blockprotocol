import { query as queryValidator } from "express-validator";
import blocksData from "../../../blocks-data.json";
import { ExpandedBlockMetadata as BlockMetadata } from "../../lib/blocks";
import { createApiKeyRequiredHandler } from "../../lib/handler/apiKeyRequiredHandler";

export type ApiSearchRequestQuery = {
  q: string;
};

export type ApiSearchResponse = {
  results: BlockMetadata[];
};

export default createApiKeyRequiredHandler<null, ApiSearchResponse>()
  .use(queryValidator("q").isString().toLowerCase())
  .get(async (req, res) => {
    const { q: query } = req.query as ApiSearchRequestQuery;

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
