import { body as bodyValidator, validationResult } from "express-validator";

import { publishBlockFromNpm } from "../../../lib/api/blocks/npm";
import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { formatErrors } from "../../../util/api";

export type ApiBlockCreateRequest = {
  blockName: string;
  npmPackageName: string;
};

export type ApiTypeCreateResponse = {
  block: ExpandedBlockMetadata;
};

export default createAuthenticatedHandler<
  ApiBlockCreateRequest,
  ApiTypeCreateResponse
>()
  .use(
    bodyValidator("blockName")
      .isString()
      .notEmpty()
      .toLowerCase(),
    bodyValidator("npmPackageName")
      .isString()
      .notEmpty()
  )
  .post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, user } = req;
    const { blockName, npmPackageName } = req.body;

    try {
      const block = await publishBlockFromNpm(db, {
        name: blockName,
        npmPackageName,
        user
      });
      return res.status(200).json({ block });
    } catch (err) {
      return res.status(400).json(
        formatErrors({
          msg: err instanceof Error ? err.message : "unknown error"
        })
      );
    }
  });
