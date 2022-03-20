import busboy from "busboy";
import { Middleware } from "next-connect";
import { BaseApiResponse } from "../handler/baseHandler";
import { AuthenticatedApiRequest } from "../handler/authenticatedHandler";
import { formatErrors } from "../../../util/api";

export type MultipartUploadsOptions = {
  fieldsLimit: number;
  filesLimit: number;
  maxFileSize: number;
};

export type UploadedFileBuffer = {
  mime: string;
  buffer: Buffer;
};

export type Field = {
  mime: string;
  encoding: string;
  truncated: boolean;
  value: string;
};

export type MultipartExtensions = {
  uploads?: Record<string, UploadedFileBuffer>;
  fields?: Record<string, Field>;
};

const parseForm = async (
  { fieldsLimit, filesLimit, maxFileSize }: MultipartUploadsOptions,
  req: AuthenticatedApiRequest<unknown>,
): Promise<MultipartExtensions> => {
  return new Promise((resolve, reject) => {
    const form = busboy({
      headers: req.headers,
      limits: {
        fields: fieldsLimit,
        files: filesLimit,
        fileSize: maxFileSize,
      },
    });
    const uploads: Record<string, UploadedFileBuffer> = {};
    const fields: Record<string, Field> = {};

    const buffers: Record<string, Uint8Array[]> = {};
    form.on("file", (fieldName, file, info) => {
      buffers[fieldName] = [];
      file.on("data", (data) => {
        buffers[fieldName]!.push(data);
      });
      file.on("limit", () => {
        reject(
          new Error(
            `Supplied file is too big. Maximum size allowed is ${maxFileSize} bytes.`,
          ),
        );
      });
      file.on("end", () => {
        uploads[fieldName] = {
          mime: info.mimeType,
          buffer: Buffer.concat(buffers[fieldName]!),
        };
      });
    });

    form.on("field", (name, value, info) => {
      fields[name] = {
        mime: info.mimeType,
        encoding: info.encoding,
        truncated: info.valueTruncated,
        value,
      };
    });
    form.on("error", (err) => {
      reject(err);
    });
    form.on("filesLimit", () => {
      reject(new Error(`Limit of ${filesLimit} files exceeded.`));
    });
    form.on("fieldsLimit", () => {
      reject(new Error(`Limit of ${fieldsLimit} value fields exceeded.`));
    });
    form.on("finish", () => {
      resolve({ uploads, fields });
    });
    req.pipe(form);
  });
};

export const multipartUploads: (
  filesLimit: MultipartUploadsOptions,
) => Middleware<
  AuthenticatedApiRequest<MultipartExtensions>,
  BaseApiResponse
> = (options: MultipartUploadsOptions) => async (req, res, next) => {
  const contentType = req.headers["content-type"];
  if (contentType?.includes("multipart/form-data")) {
    try {
      req.body = await parseForm(options, req);

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
            msg: "Unknown error while trying to receive uploaded files.",
            param: "image",
          }),
        );
      }
    }
  } else {
    next();
  }
};
