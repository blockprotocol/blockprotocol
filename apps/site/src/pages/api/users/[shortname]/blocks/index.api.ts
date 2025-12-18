import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../../../lib/api/handler/base-handler";
import { User } from "../../../../../lib/api/model/user.model";
import { ExpandedBlockMetadata } from "../../../../../lib/blocks";
import { formatErrors } from "../../../../../util/api";

export type ApiBlocksByUserResponseQueryParams = {
  shortname: string;
};

export type ApiBlocksByUserResponse = {
  blocks: ExpandedBlockMetadata[];
};

export default createBaseHandler<null, ApiBlocksByUserResponse>()
  .get(async (req, res) => {
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

    const blocks = await user.blocks();

    res.status(200).send({ blocks });
  })
  .handler(baseHandlerOptions);
