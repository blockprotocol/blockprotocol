import mimeType from "mime-types";

import { uploadFileBufferToS3 } from "../../lib/awsS3";
import {
  AuthenticatedApiRequest,
  createAuthenticatedHandler,
} from "../../lib/api/handler/authenticatedHandler";

import {
  MultipartExtensions,
  multipartUploads,
} from "../../lib/api/middleware/multipartUploads.middleware";
import { formatErrors } from "../../util/api";

type Response = {
  avatarUrl: string;
};

const checkFiletypeAllowed = (extension: string | false) => {
  const imageExts = ["jpg", "jpeg", "png", "gif", "svg"];
  if (!imageExts.some((ext) => ext === extension)) {
    throw new Error(
      `Please provide a file in one of the formats: ${imageExts.join(", ")}.`,
    );
  }
};

const checkSvg = (svgBuffer: Buffer) => {
  if (
    svgBuffer
      .toString()
      .match(
        /(script|entity|onerror|onload|onmouseover|onclick|onfocus|foreignObject|<a)/i,
      )
  ) {
    throw new Error("Given SVG content is disallowed.");
  }
};

async function validateImage(mime: string, buffer: Buffer) {
  const extension = mimeType.extension(mime);

  if (!extension) {
    throw new Error(`Could not determine extension from file upload`);
  }

  checkFiletypeAllowed(extension);

  if (extension === "svg") {
    await checkSvg(buffer);
  }
}

export default createAuthenticatedHandler<
  AuthenticatedApiRequest & MultipartExtensions,
  Response
>()
  .use(
    multipartUploads({
      fieldsLimit: 0,
      filesLimit: 1,
      maxFileSize: 5 * 1024 * 1024, // bytes = 5MB
    }),
  )
  .post(async (req, res) => {
    const { body, user, db } = req;

    if (body?.uploads?.image) {
      try {
        const { mime, buffer } = body.uploads?.image ?? {};
        await validateImage(mime, buffer);

        const { fullUrl, s3Key } = await uploadFileBufferToS3(
          buffer,
          mime || "",
          new Date().valueOf().toString(),
          `avatars/${user.id}`,
        );

        // @todo should we delete previous user avatar before replacing it?
        await user.update(db, {
          userAvatar: { url: fullUrl, s3Key },
        });

        res.status(200).json({ avatarUrl: fullUrl });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json(
            formatErrors({
              msg: error.message,
              param: "image",
            }),
          );
        } else {
          res.status(400).json(
            formatErrors({
              msg: "Unknown error while trying to receive uploaded files.",
              param: "image",
            }),
          );
        }
      }
    } else {
      res.status(400).json(
        formatErrors({
          msg: "No file given in 'image' field. Please upload a file.",
          param: "image",
        }),
      );
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};
