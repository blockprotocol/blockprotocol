import { createAuthenticatedHandler } from "../../lib/handler/authenticatedHandler";
import { SerializedUser } from "../../lib/model/user.model";

export type ApiMeResponse = {
  user: SerializedUser;
};

export default createAuthenticatedHandler<undefined, ApiMeResponse>().get(
  (req, res) => {
    const { user } = req;

    res.status(200).send({ user: user.serialize() });
  },
);
