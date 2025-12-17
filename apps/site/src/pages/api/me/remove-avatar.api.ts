import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../util/api";

export type RemoveAvatarResponse = "SUCCESS";

export default createAuthenticatedHandler<unknown, RemoveAvatarResponse>()
  .delete(async (req, res) => {
    const { user, db } = req;

    // user is guaranteed to exist by isLoggedInMiddleware
    if (!user) {
      return res.status(401).send("SUCCESS");
    }

    try {
      await user.update(db, {
        userAvatar: undefined,
      });

      res.status(200).send("SUCCESS");
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json(
          formatErrors({
            msg: error.message,
          }),
        );
      } else {
        res.status(400).json(
          formatErrors({
            msg: "Unknown error while trying to remove avatar.",
          }),
        );
      }
    }
  })
  .handler(baseHandlerOptions);
