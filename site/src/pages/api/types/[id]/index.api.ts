import { createBaseHandler } from "../../../../lib/handler/baseHandler";
import { EntityType } from "../../../../lib/model/entityType.model";
import { formatErrors } from "../../../../util/api";

export type ApiTypeByIdRequest = {
  id: string;
};

export type ApiTypeByIdResponse = { entityType: EntityType };

export default createBaseHandler<null, ApiTypeByIdResponse>().get(
  async (req, res) => {
    const { db, query } = req;
    const { id } = query as ApiTypeByIdRequest;

    const entityType = await EntityType.getById(db, { entityTypeId: id });

    if (!entityType) {
      return res.status(400).json(
        formatErrors({
          msg: "Cannot find EntityType with id",
          param: "id",
          value: id,
        }),
      );
    }

    res.status(200).send({ entityType });
  },
);
