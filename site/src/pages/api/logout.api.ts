import { createAuthenticatedHandler } from "../../lib/api/handler/authenticated-handler";

type LogoutResponse = "SUCCESS";

export default createAuthenticatedHandler<unknown, LogoutResponse>().post(
  async (req, res) => {
    await new Promise<void>((resolve) => {
      req.logout(() => {
        resolve();
      });
    });

    res.status(200).send("SUCCESS");
  },
);
