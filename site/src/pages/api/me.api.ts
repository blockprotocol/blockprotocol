import { createBaseHandler } from "../../lib/api/handler/base-handler";
import { SerializedUser } from "../../lib/api/model/user.model";

export type ApiMeResponse = { user: SerializedUser } | { guest: true };

export default createBaseHandler<undefined, ApiMeResponse>().get((req, res) => {
  const { user } = req;

  if (user) {
    res.status(200).json({ user: user.serialize(true) });
  } else {
    res.status(200).json({ guest: true });
  }
});
