import { createAuthenticatedHandler } from "../../lib/handler/authenticatedHandler";
import { SerializedUser } from "../../lib/model/user.model";

export type ApiMeResponse = {
  user: SerializedUser;
};

export default createAuthenticatedHandler<undefined, ApiMeResponse>(false).get(
  (req, res) => {
    const { user } = req;

    res.status(200).json({ user: user.serialize() });
  },
);
