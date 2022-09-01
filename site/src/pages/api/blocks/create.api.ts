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
type ApiNpmBlockCreateRequest = MultipartExtensions<
  null,
  "npmPackageName" | "blockName"
>;

// The body we expect when provided a tarball of block source directly
type ApiTarballBlockCreateRequest = MultipartExtensions<"tarball", "blockName">;

export type ApiBlockCreateRequest =
  | ApiNpmBlockCreateRequest
  | ApiTarballBlockCreateRequest;

export type ApiBlockCreateResponse = {
  block: ExpandedBlockMetadata;
};

export default createAuthenticatedHandler<
  ApiBlockCreateRequest,
  ApiBlockCreateResponse
>()
  .use(
    multipartUploads({
      fieldsLimit: 2,
      filesLimit: 1,
      maxFileSize: 10 * 1024 * 1024, // bytes = 10MB
    }),
  )
  .post(async (req, res) => {
    if (!req.body?.fields) {
      return res.status(400).json(
        formatErrors({
          msg: "No string fields provided in body. Provide either 'blockName' (when providing a 'tarball' file), or 'blockName' and 'npmPackageName'",
          code: "INVALID_INPUT",
        }),
      );
    }

    const untransformedBlockName = req.body.fields.blockName?.value;

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

    if (!("npmPackageName" in req.body.fields) && !req.body.uploads?.tarball) {
      return res.status(400).json(
        formatErrors({
          msg: "You must provide a 'tarball' file upload if not providing an npmPackageName",
          code: "INVALID_INPUT",
        }),
      );
    } else if (
      !req.body.uploads?.tarball &&
      (!("npmPackageName" in req.body.fields) ||
        !req.body.fields?.npmPackageName?.value)
    ) {
      return res.status(400).json(
        formatErrors({
          msg: "You must provide an 'npmPackageName' field if not providing a 'tarball' file upload",
          code: "INVALID_INPUT",
        }),
      );
    }

    try {
      const block = await ("npmPackageName" in req.body.fields
        ? publishBlockFromNpm(db, {
            createdAt: null,
            npmPackageName: req.body.fields.npmPackageName!.value, // we checked that this exists above
            pathWithNamespace,
          })
        : publishBlockFromTarball(db, {
            createdAt: null,
            pathWithNamespace,
            tarball: req.body.uploads!.tarball!.buffer, // we checked that this exists above
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
