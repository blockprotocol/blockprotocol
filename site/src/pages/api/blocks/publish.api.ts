import { getDbBlock } from "../../../lib/api/blocks/db";
import { publishBlockFromTarball } from "../../../lib/api/blocks/from-tarball";
import { createApiKeyRequiredHandler } from "../../../lib/api/handler/api-key-required-handler";
import {
  MultipartExtensions,
  multipartUploads,
} from "../../../lib/api/middleware/multipart-uploads.middleware";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import {
  formatErrors,
  isErrorContainingCauseWithCode,
} from "../../../util/api";
import {
  createPathWithNamespace,
  generateSlug,
  revalidateMultiBlockPages,
} from "./shared";

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
      maxFileSize: 10 * 1024 * 1024, // bytes = 10MB
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

    try {
      const block = await publishBlockFromTarball(db, {
        createdAt: existingBlock ? null : new Date().toISOString(),
        pathWithNamespace,
        tarball: req.body.uploads.tarball.buffer,
      });

      await revalidateMultiBlockPages(res, shortname);
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
