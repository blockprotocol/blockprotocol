import { uploadFileBufferToS3 } from "../../lib/awsS3";
import {
  AuthenticatedApiRequest,
  createAuthenticatedHandler,
} from "../../lib/handler/authenticatedHandler";

import {
  FormRequestExtensions,
  imageUploadMultipart,
} from "../../lib/middleware/imageUploadMultipart";
import { formatErrors } from "../../util/api";

type Response = {
  avatarUrl: string;
};

export default createAuthenticatedHandler<
  AuthenticatedApiRequest & FormRequestExtensions,
  Response
>()
  .use(imageUploadMultipart)
  .post(async (req, res) => {
    const { body, user, db } = req;

    if (body?.upload && body.upload?.mime) {
      const { mime, buffer: stream } = body.upload;
      const { fullUrl, s3Key } = await uploadFileBufferToS3(
        stream,
        mime || "",
        new Date().valueOf().toString(),
        `avatars/${user.id}`,
      );

      // @todo should we delete previous user avatar before replacing it?
      await user.update(db, {
        userAvatar: { url: fullUrl, s3Key },
      });

      res.status(200).json({ avatarUrl: fullUrl });
    } else {
      res.status(400).json(
        formatErrors({
          msg: "No file given. Please upload a file.",
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
