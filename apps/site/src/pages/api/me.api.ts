import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { SESSION_COOKIE_NAME } from "../../lib/api/middleware/constants";
import { SerializedUser } from "../../lib/api/model/user.model";

export type ApiMeResponse = { user: SerializedUser } | { guest: true };

export default createBaseHandler<undefined, ApiMeResponse>()
  .get((req, res) => {
    const { user } = req;

    if (user) {
      res.status(200).json({ user: user.serialize(true) });
    } else {
      res.setHeader(
        "Set-Cookie",
        `${SESSION_COOKIE_NAME}=; Max-Age=-1; Path=/`,
      );

      res.status(200).json({ guest: true });
    }
  })
  .handler(baseHandlerOptions);
