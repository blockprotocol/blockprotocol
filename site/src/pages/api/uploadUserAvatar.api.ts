// import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders";
import { uploadFileStreamToS3 } from "../../lib/awsS3";
import {
  AuthenticatedApiRequest,
  createAuthenticatedHandler,
} from "../../lib/handler/authenticatedHandler";

import {
  FormRequestExtensions,
  imageUploadMultipart,
} from "../../lib/middleware/multipart";

type Response = {
  fullUrl: string;
};

export default createAuthenticatedHandler<
  AuthenticatedApiRequest & FormRequestExtensions,
  Response
>()
  .use(imageUploadMultipart)
  .post(async (req, res) => {
    const { body, user, db } = req;

    if (body?.upload && body.upload?.file) {
      const { file, stream } = body.upload;
      const { fullUrl, s3Key } = await uploadFileStreamToS3(
        stream,
        file.mimetype || "",
        new Date().valueOf().toString(),
        `avatars/${user.id}`,
        "image",
      );

      // @todo should we delete previous user avatar before replacing it?

      await user.update(db, {
        userAvatar: { url: fullUrl, s3Key },
      });

      res.status(200).json({ fullUrl });
    } else {
      throw new Error("No file given. Please upload a file.");
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};
