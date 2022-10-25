import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders.js";

import { getDbBlock } from "../../../lib/api/blocks/db.js";
import { publishBlockFromNpm } from "../../../lib/api/blocks/npm.js";
import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler.js";
import { ExpandedBlockMetadata } from "../../../lib/blocks.js";
import { shouldAllowNpmBlockPublishing } from "../../../lib/config.js";
import {
  formatErrors,
  isErrorContainingCauseWithCode,
} from "../../../util/api.js";
import { createPathWithNamespace } from "./shared/naming.js";
import { revalidateBlockPages } from "./shared/revalidate.js";

// The body we expect when updating an npm-linked block
export type ApiBlockUpdateRequest = { blockName: string };

export type ApiBlockUpdateResponse = {
  block: ExpandedBlockMetadata;
};

/**
 * Updates a block linked to an npm package, which was previously created using the 'create' endpoint
 */
export default createAuthenticatedHandler<
  ApiBlockUpdateRequest,
  ApiBlockUpdateResponse
>()
  .use(bodyValidator("blockName").isString().notEmpty().toLowerCase())
  .post(async (req, res) => {
    if (!shouldAllowNpmBlockPublishing) {
      return res
        .status(501)
        .json(formatErrors({ msg: "Publishing is not supported." }));
    }

    const { blockName } = req.body;

    if (!blockName) {
      return res.status(400).json(
        formatErrors({
          msg: "You must provide a blockName",
          code: "INVALID_INPUT",
        }),
      );
    }

    const {
      db,
      user: { shortname },
    } = req;

    if (!shortname) {
      return res.status(403).json(
        formatErrors({
          code: "SIGNUP_INCOMPLETE",
          msg: "You must be signed up to complete this request",
        }),
      );
    }

    const existingBlock = await getDbBlock({
      name: blockName,
      author: shortname,
    });

    if (!existingBlock) {
      return res.status(404).json(
        formatErrors({
          code: "NOT_FOUND",
          msg: `Block name '${blockName}' does not exist in account ${shortname}`,
        }),
      );
    }

    if (!existingBlock.npmPackageName) {
      return res.status(401).json(
        formatErrors({
          code: "NOT_FOUND",
          msg: `Block '${blockName}' is not linked to an npm package. Are you looking for the /api/blocks/publish endpoint?`,
        }),
      );
    }

    if (!existingBlock.createdAt) {
      return res.status(500).json(
        formatErrors({
          code: "UNEXPECTED_STATE",
          msg: `Block name '${blockName}' has no 'createdAt' Date set.`,
        }),
      );
    }

    const pathWithNamespace = createPathWithNamespace(blockName, shortname);

    try {
      const block = await publishBlockFromNpm(db, {
        createdAt: existingBlock.createdAt,
        npmPackageName: existingBlock.npmPackageName,
        pathWithNamespace,
      });

      await revalidateBlockPages(res, shortname, blockName);
      return res.status(200).json({ block });
    } catch (err) {
      const errIsError = err instanceof Error;

      const code = isErrorContainingCauseWithCode(err)
        ? err.cause.code
        : undefined;

      return res.status(400).json(
        formatErrors({
          code,
          msg: errIsError ? err.message : "unknown error",
        }),
      );
    }
  });
