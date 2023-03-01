import { createAuthenticatedHandler } from "../../lib/api/handler/authenticated-handler";

type LogoutResponse = "SUCCESS";

export default createAuthenticatedHandler<unknown, LogoutResponse>().post(
  (req, res, next) => {
    req.logout(async (err?: Error) => {
      if (err) {
        return next(err);
      }

      await req.session?.destroy();

      res.status(200).send("SUCCESS");
    });
  },
);
