import { createAuthenticatedHandler } from "../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../lib/api/handler/base-handler";

type LogoutResponse = "SUCCESS";

export default createAuthenticatedHandler<unknown, LogoutResponse>()
  .post(async (req, res, next) => {
    await new Promise<void>((resolve) => {
      req.logout((err?: Error) => {
        if (err) {
          return next(err);
        } else {
          resolve();
        }
      });
    });

    await req.session?.destroy();

    res.status(200).send("SUCCESS");
  })
  .handler(baseHandlerOptions);
