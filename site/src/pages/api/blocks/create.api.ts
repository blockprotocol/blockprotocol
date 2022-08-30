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
import {
  createPathWithNamespace,
  generateSlug,
  revalidateMultiBlockPages,
} from "./shared";

// The body we expect when publishing an npm-linked block
type ApiNpmBlockCreateRequest = {
  blockName: string;
  npmPackageName: string;
};

// The body we expect when provided a tarball of block source directly
type ApiTarballBlockCreateRequest = MultipartExtensions<"tarball", "blockName">;

export type ApiBlockCreateRequest =
  | ApiNpmBlockCreateRequest
  | ApiTarballBlockCreateRequest;

export type ApiTypeCreateResponse = {
  block: ExpandedBlockMetadata;
};

export default createAuthenticatedHandler<
  ApiBlockCreateRequest,
  ApiTypeCreateResponse
>()
  .use(
    multipartUploads({
      fieldsLimit: 1,
      filesLimit: 1,
      maxFileSize: 10 * 1024 * 1024, // bytes = 10MB
    }),
  )
  .post(async (req, res) => {
    const blockName =
      "blockName" in req.body
        ? req.body.blockName
        : req.body.fields?.blockName?.value;

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

    const slugifiedBlockName = generateSlug(blockName);

    const blockWithName = await getDbBlock({
      name: slugifiedBlockName,
      author: shortname,
    });

    if (blockWithName) {
      throw new Error(
        `Block name '${slugifiedBlockName}' already exists in account ${shortname}`,
        {
          cause: { code: "NAME_TAKEN" },
        },
      );
    }

    const pathWithNamespace = createPathWithNamespace(blockName, shortname);

    if (!("npmPackageName" in req.body) && !req.body.uploads?.tarball) {
      return res.status(400).json(
        formatErrors({
          msg: "You must provide a 'tarball' file upload if not providing an npmPackageName",
          code: "INVALID_INPUT",
        }),
      );
    }

    try {
      const block = await ("npmPackageName" in req.body
        ? publishBlockFromNpm(db, {
            createdAt: null,
            npmPackageName: req.body.npmPackageName,
            pathWithNamespace,
          })
        : publishBlockFromTarball(db, {
            createdAt: null,
            pathWithNamespace,
            tarball: req.body.uploads!.tarball.buffer,
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
