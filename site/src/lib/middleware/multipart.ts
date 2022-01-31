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
  });

  const contentType = req.headers["content-type"];
  if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
    form.parse(req, (err, _fields, files) => {
      const file = Object.values(files)[0];
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
