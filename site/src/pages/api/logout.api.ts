import { createAuthenticatedHandler } from "../../lib/api/handler/authenticated-handler";

type LogoutResponse = "SUCCESS";

export default createAuthenticatedHandler<unknown, LogoutResponse>().post(
  (req, res) => {
    req.logout();

    res.status(200).send("SUCCESS");
  },
);
