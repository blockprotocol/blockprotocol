import { EntityTypeWithMetadata } from "@blockprotocol/graph";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../../../../lib/api/handler/base-handler";
import { User } from "../../../../../../lib/api/model/user.model";
import { formatErrors } from "../../../../../../util/api";

export type ApiTypesByUserRequest = {
  shortname: string;
};

export type ApiTypesByUserResponse = { entityTypes: EntityTypeWithMetadata[] };

export default createBaseHandler<null, ApiTypesByUserResponse>()
  .get(async (req, res) => {
    const { db, query } = req;
    const { shortname } = query as ApiTypesByUserRequest;

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

    const entityTypes = await user.entityTypes(db);

    res.status(200).send({ entityTypes });
  })
  .handler(baseHandlerOptions);
