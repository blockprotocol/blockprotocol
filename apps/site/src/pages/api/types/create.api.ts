import { JsonObject } from "@blockprotocol/core";

import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler.js";
import { EntityType } from "../../../lib/api/model/entity-type.model.js";
import { formatErrors } from "../../../util/api.js";

export type ApiTypeCreateRequest = {
  schema: string | JsonObject;
};

export type ApiTypeCreateResponse = {
  entityType: EntityType;
};

export default createAuthenticatedHandler<
  ApiTypeCreateRequest,
  ApiTypeCreateResponse
>().post(async (req, res) => {
  const { db, user } = req;
  const { schema } = req.body;

  try {
    const entityType = await EntityType.create(db, { schema, user });
    return res.status(200).json({ entityType });
  } catch (err) {
    return res.status(400).json(
      formatErrors({
        msg: err instanceof Error ? err.message : "unknown error",
      }),
    );
  }
});
