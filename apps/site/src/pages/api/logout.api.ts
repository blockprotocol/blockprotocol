import { createAuthenticatedHandler } from "../../lib/api/handler/authenticated-handler.js";

type LogoutResponse = "SUCCESS";

export default createAuthenticatedHandler<unknown, LogoutResponse>().post(
  async (req, res) => {
    req.logout();
    await req.session?.destroy();

    res.status(200).send("SUCCESS");
  },
);
