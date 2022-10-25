import { createAuthenticatedHandler } from "../../../../lib/api/handler/authenticated-handler.js";
import { EntityType } from "../../../../lib/api/model/entity-type.model.js";
import { formatErrors } from "../../../../util/api.js";

export type ApiTypeUpdateRequest = {
  schema: string;
};

export type ApiTypeUpdateResponse = {
  entityType: EntityType;
};

export default createAuthenticatedHandler<
  ApiTypeUpdateRequest,
  ApiTypeUpdateResponse
>().put(async (req, res) => {
  const { db, user } = req;
  const { id } = req.query as { id: string };

  const { schema } = req.body;

  try {
    let entityType = await EntityType.getById(db, { entityTypeId: id });
    if (!entityType) {
      return res.status(404).json(
        formatErrors({
          msg: "Could not find entity type by id",
          param: "id",
          value: id,
        }),
      );
    } else if (user.id !== entityType.user.oid.toString()) {
      return res.status(401).json(
        formatErrors({
          msg: "You do not have permission to update this entity type.",
        }),
      );
    }

    entityType = await entityType.update(db, { schema });

    return res.status(200).json({ entityType });
  } catch (err) {
    return res.status(400).json(
      formatErrors({
        msg: err instanceof Error ? err.message : "unknown error",
      }),
    );
  }
});
