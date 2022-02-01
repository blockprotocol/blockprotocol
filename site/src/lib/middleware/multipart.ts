import formidable from "formidable";
import { Middleware } from "next-connect";
import { PassThrough } from "stream";
import { BaseApiResponse } from "../handler/baseHandler";
import { AuthenticatedApiRequest } from "../handler/authenticatedHandler";

export type FormRequestExtensions = {
  upload?: { file: formidable.File; stream: PassThrough };
};

export const imageUploadMultipart: Middleware<
  AuthenticatedApiRequest<FormRequestExtensions>,
  BaseApiResponse
> = (req, _res, next) => {
  const passThrough = new PassThrough();

  const form = new formidable.IncomingForm({
    fileWriteStreamHandler: () => {
      return passThrough;
    },
    maxFileSize: 5 * 1024 * 1024, // bytes
    // formidable allows for multiple uploads at once. Limit the size to 5 across all
    maxTotalFileSize: 5 * 1024 * 1024, // bytes
  });

  const contentType = req.headers["content-type"];
  if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
    form.parse(req, (err, _fields, files) => {
      const file = Object.values(files)[0];
      // we are only interested with the _first_ file. Ignores all other if any.
      if (!err && file) {
        req.body = {
          upload: { file: file as formidable.File, stream: passThrough },
        };
      }
      next();
    });
  } else {
    next();
  }
};
