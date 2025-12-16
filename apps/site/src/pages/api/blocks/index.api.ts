import Ajv from "ajv";
import { query as queryValidator, validationResult } from "express-validator";
import cloneDeep from "lodash/cloneDeep";

import { getAllBlocks } from "../../../lib/api/blocks/get";
import { createApiKeyRequiredHandler } from "../../../lib/api/handler/api-key-required-handler";
import { baseHandlerOptions } from "../../../lib/api/handler/base-handler";
import {
  ExpandedBlockMetadata,
  retrieveBlockFileContent,
} from "../../../lib/blocks";
import { formatErrors } from "../../../util/api";
import { parseClientIp, sendReport } from "../../../util/usage";

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

export default createApiKeyRequiredHandler<null, ApiBlockSearchResponse>()
  .use(queryValidator("author").optional().isString().toLowerCase())
  .use(queryValidator("license").optional().isString().toLowerCase())
  .use(queryValidator("name").optional().isString().toLowerCase())
  .use(queryValidator("q").optional().isString().toLowerCase())
  .use(queryValidator("json").optional().isJSON())
  .get(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const {
      author: authorQuery,
      license: licenseQuery,
      name: nameQuery,
      q: query,
      json: jsonText,
    } = req.query as ApiBlockSearchQuery;

    let data: ExpandedBlockMetadata[] = await getAllBlocks();

    if (authorQuery) {
      data = data.filter(({ author }) =>
        author?.toLowerCase().includes(authorQuery),
      );
    }

    if (licenseQuery) {
      data = data.filter(
        ({ license }) => license?.toLowerCase() === licenseQuery,
      );
    }

    if (nameQuery) {
      data = data.filter(({ displayName, name }) =>
        [displayName, name].some((item) =>
          item?.toLowerCase().includes(nameQuery),
        ),
      );
    }

    if (query) {
      data = data.filter(
        ({ displayName, variants, author, name }) =>
          [displayName, author, name].some((item) =>
            item?.toLowerCase().includes(query),
          ) ||
          variants?.some((variant) =>
            variant.name?.toLowerCase().includes(query),
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
        await Promise.all(
          data.map(async (block) => {
            const schema = (await retrieveBlockFileContent(block)).schema;
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
              ? [block, keyCountDifference]
              : null;
          }),
        )
      )
        .filter(
          (blockData): blockData is [ExpandedBlockMetadata, number] =>
            blockData !== null,
        )
        // sort by how many keys are present in the validated output after removeAdditional.
        .sort(([_, a], [__, b]) => a - b)
        .map(([block, _]) => block);
    }

    // @todo paginate response

    const clientIp = parseClientIp(req);

    const userId = req.user.id;

    await sendReport({
      event: "block_search",
      userId,
      properties: {
        origin: req.headers.origin ?? null,
        bpUserId: userId,
        ip: clientIp,
        userAgent: req.headers["user-agent"] ?? null,
        query: req.query ? JSON.stringify(req.query) : null,
        resultCount: data.length,
      },
    });

    res.status(200).json({
      results: data,
    });
  })
  .handler(baseHandlerOptions);
