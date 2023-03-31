import { createAuthenticatedHandler } from "../../lib/api/handler/authenticated-handler";
import { formatErrors } from "../../util/api";

export type RemoveUserAvatarResponse = "SUCCESS";

export default createAuthenticatedHandler<
  unknown,
  RemoveUserAvatarResponse
>().get(async (req, res) => {
  const { user, db } = req;

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
});
