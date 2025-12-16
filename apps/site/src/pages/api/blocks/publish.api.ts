import { getDbBlock } from "../../../lib/api/blocks/db";
import { publishBlockFromTarball } from "../../../lib/api/blocks/from-tarball";
import { notifySlackAboutBlock } from "../../../lib/api/blocks/slack";
import { createApiKeyRequiredHandler } from "../../../lib/api/handler/api-key-required-handler";
import { baseHandlerOptions } from "../../../lib/api/handler/base-handler";
import {
  MultipartExtensions,
  multipartUploads,
} from "../../../lib/api/middleware/multipart-uploads.middleware";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import {
  formatErrors,
  isErrorContainingCauseWithCode,
} from "../../../util/api";
import { createPathWithNamespace, generateSlug } from "./shared/naming";
import { revalidateBlockPages } from "./shared/revalidate";

type ApiBlockPublishRequest = MultipartExtensions<"tarball", "blockName">;

type ApiTypePublishResponse = {
  block: ExpandedBlockMetadata;
};

/**
 * Publishes a block from a provided tarball.
 * If the block name doesn't yet exist in this account, creates it.
 * Otherwise, updates it.
 */
export default createApiKeyRequiredHandler<
  ApiBlockPublishRequest,
  ApiTypePublishResponse
>()
  .use(
    multipartUploads({
      fieldsLimit: 1,
      filesLimit: 1,
      maxFileSize: 100 * 1024 * 1024, // bytes = 100MB
    }),
  )
  .post(async (req, res) => {
    const untransformedBlockName = req.body.fields?.blockName?.value;

    if (!untransformedBlockName) {
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
      name: canonicalBlockNameWithoutNamespace,
      author: shortname,
    });

    if (!req.body.uploads?.tarball) {
      return res.status(400).json(
        formatErrors({
          msg: "You must provide a 'tarball' containing the block's files.",
          code: "INVALID_INPUT",
        }),
      );
    }

    if (existingBlock && !existingBlock.createdAt) {
      return res.status(500).json(
        formatErrors({
          code: "UNEXPECTED_STATE",
          msg: `Block name '${canonicalBlockName}' has no 'createdAt' Date set.`,
        }),
      );
    }

    try {
      const block = await publishBlockFromTarball(db, {
        createdAt: existingBlock ? existingBlock.createdAt! : null,
        pathWithNamespace: canonicalBlockName,
        tarball: req.body.uploads.tarball.buffer,
      });

      await revalidateBlockPages(
        res,
        shortname,
        canonicalBlockNameWithoutNamespace,
      );

      await notifySlackAboutBlock(block, existingBlock ? "update" : "publish");

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

export const config = {
  api: {
    bodyParser: false,
  },
};
