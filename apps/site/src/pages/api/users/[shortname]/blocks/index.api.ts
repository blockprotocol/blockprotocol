import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../../../lib/api/handler/base-handler";
import { ExpandedBlockMetadata } from "../../../../../lib/blocks";
import { getAllBlocksByUser, getStaticUser } from "../../../../../lib/hub-data";
import { formatErrors } from "../../../../../util/api";

export type ApiBlocksByUserResponseQueryParams = {
  shortname: string;
};

export type ApiBlocksByUserResponse = {
  blocks: ExpandedBlockMetadata[];
};

export default createBaseHandler<null, ApiBlocksByUserResponse>()
  .get(async (req, res) => {
    const { shortname } = req.query as ApiBlocksByUserResponseQueryParams;

    if (!getStaticUser({ shortname })) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find user with the provided shortname",
          param: "shortname",
          value: shortname,
        }),
      );
    }

    const blocks = await getAllBlocksByUser({ shortname });

    res.status(200).send({ blocks });
  })
  .handler(baseHandlerOptions);
