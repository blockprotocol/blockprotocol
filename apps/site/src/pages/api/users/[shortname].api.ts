import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../lib/api/handler/base-handler";
import { SerializedUser, User } from "../../../lib/api/model/user.model";
import { formatErrors } from "../../../util/api";

export type ApiUserByShortnameResponseQueryParams = {
  shortname: string;
};

export type ApiUserByShortnameResponse = {
  user: SerializedUser;
};

export default createBaseHandler<null, ApiUserByShortnameResponse>()
  .get(async (req, res) => {
    const { db, query } = req;
    const { shortname } = query as ApiUserByShortnameResponseQueryParams;

    const user = await User.getByShortname(db, { shortname });

    if (!user) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find user with the provided shortname",
          param: "shortname",
          value: shortname,
        }),
      );
    }

    res.status(200).send({ user: user.serialize() });
  })
  .handler(baseHandlerOptions);
