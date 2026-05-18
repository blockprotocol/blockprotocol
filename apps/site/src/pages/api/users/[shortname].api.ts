import { SerializedUser } from "../../../context/user-context";
import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../lib/api/handler/base-handler";
import { getStaticUser } from "../../../lib/hub-data";
import { formatErrors } from "../../../util/api";

export type ApiUserByShortnameResponseQueryParams = {
  shortname: string;
};

export type ApiUserByShortnameResponse = {
  user: SerializedUser;
};

export default createBaseHandler<null, ApiUserByShortnameResponse>()
  .get((req, res) => {
    const { shortname } = req.query as ApiUserByShortnameResponseQueryParams;

    const staticUser = getStaticUser({ shortname });

    if (!staticUser) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find user with the provided shortname",
          param: "shortname",
          value: shortname,
        }),
      );
    }

    res.status(200).send({
      user: {
        id: staticUser.shortname,
        isSignedUp: true,
        shortname: staticUser.shortname,
        preferredName: staticUser.preferredName,
        userAvatarUrl: staticUser.userAvatarUrl ?? null,
      },
    });
  })
  .handler(baseHandlerOptions);
