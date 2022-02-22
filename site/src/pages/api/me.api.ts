import { createAuthenticatedHandler } from "../../lib/api/handler/authenticatedHandler";
import { SerializedUser } from "../../lib/api/model/user.model";

export type ApiMeResponse = {
  user: SerializedUser;
};

export default createAuthenticatedHandler<undefined, ApiMeResponse>(false).get(
  (req, res) => {
    const { user } = req;

    res.status(200).json({ user: user.serialize(true) });
  },
);
