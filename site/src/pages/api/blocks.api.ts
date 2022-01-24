import Ajv from "ajv";
import {
  query as queryValidator,
  body as bodyValidator,
} from "express-validator";
import { cloneDeep } from "lodash";
import blocksData from "../../../blocks-data.json";
import {
  ExpandedBlockMetadata as BlockMetadata,
  readBlockDataFromDisk,
} from "../../lib/blocks";
import { createApiKeyRequiredHandler } from "../../lib/handler/apiKeyRequiredHandler";

export type ApiSearchRequestQuery = {
  q: string;
};

export type ApiSearchBody = {
  json: string;
};

export type ApiSearchResponse = {
  results: BlockMetadata[];
};

export default createApiKeyRequiredHandler<ApiSearchBody, ApiSearchResponse>()
  .use(bodyValidator("json").isJSON())
  .use(queryValidator("q").isString().toLowerCase())
  .get(async (req, res) => {
    const { q: query } = req.query as ApiSearchRequestQuery;
    const { json } = req.body as ApiSearchBody;

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

    // beware, this is a slow operation
    // @todo optimize for quicker passes.
    if (json) {
      // If any property is not a part of the schema, remove it from the validated json
      const ajv = new Ajv({ removeAdditional: "all" });

      data = (
        data.flatMap((block) => {
          const schema = readBlockDataFromDisk(block).schema;
          const validate = ajv.compile(schema);

          // withoutAdditional is transformed in validate.
          // eslint-disable-next-line prefer-const
          let withoutAdditional = cloneDeep(json);
          const valid = validate(withoutAdditional);

          // removeAdditional lets us count how many keys are a part of the schema
          const keyCountWithouTAdditional =
            Object.keys(withoutAdditional).length;

          const keyCountDifference =
            Object.keys(json).length - keyCountWithouTAdditional;

          // Only show valid schemas with at least 1 matching field
          return valid && keyCountWithouTAdditional >= 1
            ? [[block, keyCountDifference]]
            : [];
        }) as [BlockMetadata, number][]
      )
        // sort by how many keys are present in the validated output after removeAdditional.
        .sort(([_, a], [__, b]) => a - b)
        .map(([block, _]) => block);
    }

    // @todo paginate response

    res.status(200).json({
      results: data,
    });
  });
