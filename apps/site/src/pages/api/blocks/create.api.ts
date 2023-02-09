import { body as bodyValidator, validationResult } from "express-validator";

import { getDbBlock } from "../../../lib/api/blocks/db";
import { publishBlockFromNpm } from "../../../lib/api/blocks/npm";
import { notifySlackAboutBlock } from "../../../lib/api/blocks/slack";
import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { shouldAllowNpmBlockPublishing } from "../../../lib/config";
import {
  formatErrors,
  isErrorContainingCauseWithCode,
} from "../../../util/api";
import { createPathWithNamespace, generateSlug } from "./shared/naming";
import { revalidateBlockPages } from "./shared/revalidate";

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

    const blockWithName = await getDbBlock({
      name: canonicalBlockNameWithoutNamespace,
      author: shortname,
    });

    if (blockWithName) {
      return res.status(400).json(
        formatErrors({
          msg: `Block name '${canonicalBlockNameWithoutNamespace}' already exists in account ${shortname}`,
          code: "NAME_TAKEN",
        }),
      );
    }

    try {
      const block = await publishBlockFromNpm(db, {
        createdAt: null,
        npmPackageName,
        pathWithNamespace: canonicalBlockName,
      });
      await revalidateBlockPages(res, shortname, canonicalBlockName);

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
