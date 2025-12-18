import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders";

import { getDbBlock } from "../../../lib/api/blocks/db";
import { publishBlockFromNpm } from "../../../lib/api/blocks/npm";
import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../lib/api/handler/base-handler";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { shouldAllowNpmBlockPublishing } from "../../../lib/config";
import {
  formatErrors,
  isErrorContainingCauseWithCode,
} from "../../../util/api";
import { createPathWithNamespace, generateSlug } from "./shared/naming";
import { revalidateBlockPages } from "./shared/revalidate";

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

    const { blockName: untransformedBlockName } = req.body;

    const { db, user } = req;

    // user is guaranteed to exist by isLoggedInMiddleware
    const shortname = user?.shortname;

    if (!shortname) {
      return res.status(403).json(
        formatErrors({
          code: "SIGNUP_INCOMPLETE",
          msg: "You must be signed up to complete this request",
        }),
      );
    }

    const { rawBlockNamespace, rawBlockNameWithoutNamespace } =
      untransformedBlockName.match(
        /^(@(?<rawBlockNamespace>[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*)\/)?(?<rawBlockNameWithoutNamespace>[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*)$/,
      )?.groups ?? {};

    if (!rawBlockNameWithoutNamespace) {
      return res.status(400).json(
        formatErrors({
          msg: `Block name must be a slug or defined as '@namespace/block-name' (all lowercase). Current value: '${untransformedBlockName}'`,
          code: "INVALID_INPUT",
        }),
      );
    }

    const blockName = createPathWithNamespace(
      rawBlockNameWithoutNamespace,
      rawBlockNamespace || shortname,
    );

    const canonicalBlockNameWithoutNamespace = generateSlug(
      rawBlockNameWithoutNamespace,
    );

    const canonicalBlockName = createPathWithNamespace(
      canonicalBlockNameWithoutNamespace,
      generateSlug(rawBlockNamespace || shortname),
    );

    if (canonicalBlockName !== blockName) {
      if (!rawBlockNamespace) {
        return res.status(400).json(
          formatErrors({
            msg: `Block name '${untransformedBlockName}' must be a slug. Try ${canonicalBlockNameWithoutNamespace} instead`,
            code: "INVALID_INPUT",
          }),
        );
      }
      return res.status(400).json(
        formatErrors({
          msg: `Block name '${untransformedBlockName}' does not match its canonical representation. Try ${canonicalBlockName} instead`,
          code: "INVALID_INPUT",
        }),
      );
    }

    if (rawBlockNamespace && rawBlockNamespace !== shortname) {
      return res.status(400).json(
        formatErrors({
          msg: `Unable to publish '${untransformedBlockName}' because the API key provided does not belong to '${rawBlockNamespace}'`,
          code: "INVALID_INPUT",
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
  })
  .handler(baseHandlerOptions);
