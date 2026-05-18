import { SerializedUser } from "../../context/user-context";
import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { formatErrors } from "../../util/api";

export type ApiVerifyEmailRequestBody = {
  userId: string;
  verificationCodeId: string;
  code: string;
};

export type ApiVerifyEmailResponse = {
  user: SerializedUser;
  redirectPath?: string;
  wordpressSettingsUrl?: string;
};

export default createBaseHandler<
  ApiVerifyEmailRequestBody,
  ApiVerifyEmailResponse
>()
  .post((_req, res) => {
    res.status(401).json(
      formatErrors({
        msg: "Account creation and login are temporarily paused while we focus on HASH.",
      }),
    );
  })
  .handler(baseHandlerOptions);
