import { body as bodyValidator, validationResult } from "express-validator";

import { getDbBlock } from "../../../lib/api/blocks/db.js";
import { publishBlockFromNpm } from "../../../lib/api/blocks/npm.js";
import { notifySlackAboutBlock } from "../../../lib/api/blocks/slack.js";
import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler.js";
import { ExpandedBlockMetadata } from "../../../lib/blocks.js";
import { shouldAllowNpmBlockPublishing } from "../../../lib/config.js";
import {
  formatErrors,
  isErrorContainingCauseWithCode,
} from "../../../util/api.js";
import { createPathWithNamespace, generateSlug } from "./shared/naming.js";
import { revalidateBlockPages } from "./shared/revalidate.js";

// The body we expect when publishing an npm-linked block
export type ApiBlockCreateRequest = {
  npmPackageName: string;
  blockName: string;
};

export type ApiBlockCreateResponse = {
  block: ExpandedBlockMetadata;
};

/**
 * Creates a block linked to an already-published npm package
 */
export default createAuthenticatedHandler<
  ApiBlockCreateRequest,
  ApiBlockCreateResponse
>()
  .use(
    bodyValidator("blockName").isString().notEmpty().toLowerCase(),
    bodyValidator("npmPackageName").isString().notEmpty(),
  )
  .post(async (req, res) => {
    if (!shouldAllowNpmBlockPublishing) {
      return res
        .status(501)
        .json(formatErrors({ msg: "Publishing is not supported." }));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
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

    const { blockName: untransformedBlockName, npmPackageName } = req.body;

    const slugifiedBlockName = generateSlug(untransformedBlockName);

    if (slugifiedBlockName !== untransformedBlockName) {
      return res.status(400).json(
        formatErrors({
          msg: `Block name '${untransformedBlockName}' must be a slug. Try ${slugifiedBlockName} instead`,
          code: "NAME_TAKEN",
        }),
      );
    }

    const blockWithName = await getDbBlock({
      name: slugifiedBlockName,
      author: shortname,
    });

    if (blockWithName) {
      return res.status(400).json(
        formatErrors({
          msg: `Block name '${slugifiedBlockName}' already exists in account ${shortname}`,
          code: "NAME_TAKEN",
        }),
      );
    }

    const pathWithNamespace = createPathWithNamespace(
      slugifiedBlockName,
      shortname,
    );

    try {
      const block = await publishBlockFromNpm(db, {
        createdAt: null,
        npmPackageName,
        pathWithNamespace,
      });
      await revalidateBlockPages(res, shortname, slugifiedBlockName);

      await notifySlackAboutBlock(block, "publish");
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
