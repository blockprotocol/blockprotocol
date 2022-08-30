import { getDbBlock } from "../../../lib/api/blocks/db";
import { publishBlockFromTarball } from "../../../lib/api/blocks/from-tarball";
import { publishBlockFromNpm } from "../../../lib/api/blocks/npm";
import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import {
  MultipartExtensions,
  multipartUploads,
} from "../../../lib/api/middleware/multipart-uploads.middleware";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import {
  formatErrors,
  isErrorContainingCauseWithCode,
} from "../../../util/api";
import { createPathWithNamespace, revalidateMultiBlockPages } from "./shared";

// The body we expect when updating an npm-linked block
type ApiNpmBlockUpdateRequest = MultipartExtensions<null, "blockName">;

// The body we expect when updating a directly-uploaded block
type ApiTarballBlockUpdateRequest = MultipartExtensions<"tarball", "blockName">;

export type ApiBlockUpdateRequest =
  | ApiNpmBlockUpdateRequest
  | ApiTarballBlockUpdateRequest;

export type ApiBlockUpdateResponse = {
  block: ExpandedBlockMetadata;
};

export default createAuthenticatedHandler<
  ApiBlockUpdateRequest,
  ApiBlockUpdateResponse
>()
  .use(
    multipartUploads({
      fieldsLimit: 1,
      filesLimit: 1,
      maxFileSize: 10 * 1024 * 1024, // bytes = 10MB
    }),
  )
  .post(async (req, res) => {
    const blockName = req.body.fields?.blockName?.value;

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

    const tarball = "uploads" in req.body && req.body.uploads?.tarball?.buffer;

    if (existingBlock.npmPackageName && tarball) {
      return res.status(404).json(
        formatErrors({
          code: "INVALID_INPUT",
          msg: `Block name '${blockName}' is linked to an npm package, but you provided a tarball directly.`,
        }),
      );
    } else if (!existingBlock.npmPackageName && !tarball) {
      return res.status(404).json(
        formatErrors({
          code: "INVALID_INPUT",
          msg: `You must provide a tarball containing the new files for '${blockName}'.`,
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
      const block = await (existingBlock.npmPackageName
        ? publishBlockFromNpm(db, {
            createdAt: existingBlock.createdAt,
            npmPackageName: existingBlock.npmPackageName,
            pathWithNamespace,
          })
        : publishBlockFromTarball(db, {
            createdAt: existingBlock.createdAt,
            pathWithNamespace,
            tarball: tarball as Buffer, // we returned an error if neither npmPackageName nor tarball are truthy
          }));

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
