import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { formatErrors } from "../../util/api";

export type ApiSignupRequestBody = {
  email: string;
};

export type ApiSignupResponse = {
  userId: string;
  verificationCodeId: string;
};

export default createBaseHandler<ApiSignupRequestBody, ApiSignupResponse>()
  .post((_req, res) => {
    res.status(401).json(
      formatErrors({
        msg: "Account creation and login are temporarily paused while we focus on HASH.",
      }),
    );
  })
  .handler(baseHandlerOptions);
