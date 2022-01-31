import { JSONObject } from "blockprotocol";
import { createAuthenticatedHandler } from "../../../lib/handler/authenticatedHandler";
import { EntityType } from "../../../lib/model/entityType.model";
import { formatErrors } from "../../../util/api";

export type ApiTypeCreateRequest = {
  schema: string | JSONObject;
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
