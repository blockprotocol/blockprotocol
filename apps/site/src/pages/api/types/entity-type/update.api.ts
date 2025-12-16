import { EntityType, EntityTypeWithMetadata } from "@blockprotocol/graph";
import { VersionedUrl } from "@blockprotocol/type-system/slim";
import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders";

import { createAuthenticatedHandler } from "../../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../../util/api";
import { SystemDefinedProperties } from "../shared/constants";
import { updateEntityType } from "./shared/db";

export type ApiEntityTypeUpdateRequest = {
  versionedUrl: VersionedUrl;
  schema: Omit<EntityType, SystemDefinedProperties>;
};

export type ApiEntityTypeUpdateResponse = {
  entityType: EntityTypeWithMetadata;
};

export default createAuthenticatedHandler<
  ApiEntityTypeUpdateRequest,
  ApiEntityTypeUpdateResponse
>()
  .use(
    bodyValidator("schema").isObject(),
    bodyValidator("versionedUrl").isString().notEmpty(),
  )
  .put(async (req, res) => {
    const { db, user } = req;

    const { versionedUrl, schema } = req.body;

    try {
      const dbRecord = await updateEntityType(db, {
        versionedUrl,
        schema,
        user,
      });

      return res
        .status(200)
        .json({ entityType: dbRecord.entityTypeWithMetadata });
    } catch (err) {
      return res.status(400).json(
        formatErrors({
          msg: err instanceof Error ? err.message : "unknown error",
        }),
      );
    }
  })
  .handler(baseHandlerOptions);
