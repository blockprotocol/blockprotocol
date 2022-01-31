import Ajv from "ajv";
import { query as queryValidator } from "express-validator";
import { cloneDeep } from "lodash";
import blocksData from "../../../blocks-data.json";
import {
  ExpandedBlockMetadata as BlockMetadata,
  readBlockDataFromDisk,
} from "../../lib/blocks";
import { createApiKeyRequiredHandler } from "../../lib/handler/apiKeyRequiredHandler";

export type ApiSearchRequestQuery = {
  q?: string;
  json?: string;
};

export type ApiSearchResponse = {
  results: BlockMetadata[];
};

export default createApiKeyRequiredHandler<null, ApiSearchResponse>()
  .use(queryValidator("q").isString().toLowerCase())
  .use(queryValidator("json").isJSON())
  .get(async (req, res) => {
    const { q: query, json: jsonText } = req.query as ApiSearchRequestQuery;

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
    if (jsonText) {
      const json = JSON.parse(jsonText);

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
          const keyCountWithoutAdditional =
            Object.keys(withoutAdditional).length;

          const keyCountDifference =
            Object.keys(json).length - keyCountWithoutAdditional;

          // Only show valid schemas with at least 1 matching field
          return valid && keyCountWithoutAdditional >= 1
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
