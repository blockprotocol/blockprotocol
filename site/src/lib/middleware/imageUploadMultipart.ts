import busboy from "busboy";
import mime from "mime-types";
import { Middleware } from "next-connect";
import { BaseApiResponse } from "../handler/baseHandler";
import { AuthenticatedApiRequest } from "../handler/authenticatedHandler";
import { formatErrors } from "../../util/api";

export type UploadedFileBuffer = {
  mime: string;
  buffer: Buffer;
};

export type FormRequestExtensions = {
  upload?: UploadedFileBuffer;
};

const parseForm = async (
  req: AuthenticatedApiRequest<unknown>,
): Promise<UploadedFileBuffer> => {
  return new Promise((resolve, reject) => {
    let result: UploadedFileBuffer | null = null;
    const form = busboy({
      headers: req.headers,
      limits: {
        fields: 0,
        files: 1,
        fileSize: 5 * 1024 * 1024, // bytes = 5MB
      },
    });
    form.on("file", (_name, file, info) => {
      const buffer: Uint8Array[] = [];
      file.on("data", (data) => {
        buffer.push(data);
      });
      file.on("limit", () => {
        reject(
          new Error(
            "Supplied image file is too big. Maximum size allowed is 5 MB.",
          ),
        );
      });
      file.on("end", () => {
        result = { mime: info.mimeType, buffer: Buffer.concat(buffer) };
      });
    });
    form.on("error", (err) => {
      reject(err);
    });
    form.on("finish", () => {
      if (!result) {
        reject(new Error("Please provide an image file in multipart form."));
      } else {
        resolve(result);
      }
    });
    req.pipe(form);
  });
};

const checkFiletypeAllowed = (extension: string | false) => {
  const imageExts = ["jpg", "jpeg", "png", "gif", "svg"];
  if (!imageExts.some((ext) => ext === extension)) {
    throw new Error(
      `Please provide a file in one of the formats: ${imageExts.join(", ")}.`,
    );
  }
};

export const checkSvg = (svgBuffer: Buffer) => {
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
export const imageUploadMultipart: Middleware<
  AuthenticatedApiRequest<FormRequestExtensions>,
  BaseApiResponse
> = async (req, res, next) => {
  const contentType = req.headers["content-type"];
  if (contentType?.includes("multipart/form-data")) {
    try {
      const upload = await parseForm(req);

      const extension = mime.extension(upload.mime);

      if (!extension) {
        throw new Error(`Could not determine extension from file upload`);
      }
      checkFiletypeAllowed(extension);

      if (extension === "svg") {
        await checkSvg(upload.buffer);
      }

      req.body = { upload };
      next();
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
            msg: "Unknown error while trying to receive uploaded file.",
            param: "image",
          }),
        );
      }
    }
  } else {
    next();
  }
};
