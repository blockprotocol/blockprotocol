import { createBaseHandler } from "../../../../../lib/api/handler/baseHandler";
import { User } from "../../../../../lib/api/model/user.model";
import { formatErrors } from "../../../../../util/api";
import { ExpandedBlockMetadata } from "../../../../../lib/blocks";

export type ApiBlocksByUserResponseQueryParams = {
  shortname: string;
};

export type ApiBlocksByUserResponse = {
  blocks: ExpandedBlockMetadata[];
};

export default createBaseHandler<null, ApiBlocksByUserResponse>().get(
  async (req, res) => {
    const { db, query } = req;
    const { shortname } = query as ApiBlocksByUserResponseQueryParams;

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

    const blocks = user.blocks();

    res.status(200).send({ blocks });
  },
);
