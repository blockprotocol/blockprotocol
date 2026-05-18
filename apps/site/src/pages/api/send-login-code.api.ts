import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { formatErrors } from "../../util/api";

export type ApiSendLoginCodeRequestBody = {
  email: string;
};

export type ApiSendLoginCodeResponse = {
  userId: string;
  verificationCodeId: string;
};

export default createBaseHandler<
  ApiSendLoginCodeRequestBody,
  ApiSendLoginCodeResponse
>()
  .post((_req, res) => {
    res.status(401).json(
      formatErrors({
        msg: "Account creation and login are temporarily paused while we focus on HASH.",
      }),
    );
  })
  .handler(baseHandlerOptions);
