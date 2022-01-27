import { createBaseHandler } from "../../../../../lib/handler/baseHandler";
import { EntityType } from "../../../../../lib/model/entityType.model";
import { formatErrors } from "../../../../../util/api";
import { User } from "../../../../../lib/model/user.model";

export type ApiTypeByUserAndTitleRequest = {
  title: string;
  shortname: string;
};

export type ApiTypeByUserAndTitleResponse = { entityType: EntityType };

export default createBaseHandler<null, ApiTypeByUserAndTitleResponse>().get(
  async (req, res) => {
    const { db, query } = req;
    const { shortname, title } = query as ApiTypeByUserAndTitleRequest;

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

    const entityType = await EntityType.getByUserAndTitle(db, {
      title,
      user: user.toRef(),
    });

    if (!entityType) {
      return res.status(400).json(
        formatErrors({
          msg: "Cannot find EntityType with title belonging to user.",
          param: "title",
          value: title,
        }),
      );
    }

    res.status(200).send({ entityType });
  },
);
