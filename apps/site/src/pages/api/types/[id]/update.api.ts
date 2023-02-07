import { EntityType, EntityTypeWithMetadata } from "@blockprotocol/graph";

import { createAuthenticatedHandler } from "../../../../lib/api/handler/authenticated-handler";
import { formatErrors } from "../../../../util/api";

export type ApiTypeUpdateRequest = {
  entityType: EntityType;
};

export type ApiTypeUpdateResponse = EntityTypeWithMetadata;

export default createAuthenticatedHandler<
  ApiTypeUpdateRequest,
  ApiTypeUpdateResponse
>().put(async (req, res) => {
  const { db: _db, user: _user } = req;
  const { id: _entityTypeId } = req.query as { id: string };

  const { entityType: _entityType } = req.body;

  try {
    return res.status(200).json({} as ApiTypeUpdateResponse);
  } catch (err) {
    return res.status(400).json(
      formatErrors({
        msg: err instanceof Error ? err.message : "unknown error",
      }),
    );
  }
});
