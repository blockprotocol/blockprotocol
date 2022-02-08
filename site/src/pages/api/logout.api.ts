import { createAuthenticatedHandler } from "../../lib/api/handler/authenticatedHandler";

type LogoutResponse = "SUCCESS";

export default createAuthenticatedHandler<unknown, LogoutResponse>().post(
  (req, res) => {
    req.logout();

    res.status(200).send("SUCCESS");
  },
);
