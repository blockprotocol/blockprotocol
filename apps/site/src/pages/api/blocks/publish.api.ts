import { getDbBlock } from "../../../lib/api/blocks/db.js";
import { publishBlockFromTarball } from "../../../lib/api/blocks/from-tarball.js";
import { notifySlackAboutBlock } from "../../../lib/api/blocks/slack.js";
import { createApiKeyRequiredHandler } from "../../../lib/api/handler/api-key-required-handler.js";
import {
  MultipartExtensions,
  multipartUploads,
} from "../../../lib/api/middleware/multipart-uploads.middleware.js";
import { ExpandedBlockMetadata } from "../../../lib/blocks.js";
import {
  formatErrors,
  isErrorContainingCauseWithCode,
} from "../../../util/api.js";
import { createPathWithNamespace, generateSlug } from "./shared/naming.js";
import { revalidateBlockPages } from "./shared/revalidate.js";

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

    const slugifiedBlockName = generateSlug(untransformedBlockName);

    if (slugifiedBlockName !== untransformedBlockName) {
      return res.status(400).json(
        formatErrors({
          msg: `Block name '${untransformedBlockName}' must be a slug. Try ${slugifiedBlockName} instead`,
          code: "NAME_TAKEN",
        }),
      );
    }

    const existingBlock = await getDbBlock({
      name: slugifiedBlockName,
      author: shortname,
    });

    const pathWithNamespace = createPathWithNamespace(
      slugifiedBlockName,
      shortname,
    );

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
          msg: `Block name '${slugifiedBlockName}' has no 'createdAt' Date set.`,
        }),
      );
    }

    try {
      const block = await publishBlockFromTarball(db, {
        createdAt: existingBlock ? existingBlock.createdAt! : null,
        pathWithNamespace,
        tarball: req.body.uploads.tarball.buffer,
      });

      await revalidateBlockPages(res, shortname, slugifiedBlockName);

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
  });

export const config = {
  api: {
    bodyParser: false,
  },
};
