import { SerializedUser } from "../../context/user-context";
import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";

export type ApiMeResponse = { user: SerializedUser } | { guest: true };

export default createBaseHandler<undefined, ApiMeResponse>()
  .get((_req, res) => {
    res.status(200).json({ guest: true });
  })
  .handler(baseHandlerOptions);
