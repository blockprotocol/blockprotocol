import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import { EntityType } from "@blockprotocol/type-system";
import { body as bodyValidator } from "express-validator";

import { createAuthenticatedHandler } from "../../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../../util/api";
import { SystemDefinedProperties } from "../shared/constants";
import { createEntityType } from "./shared/db";

export type ApiEntityTypeCreateRequest = {
  schema: Partial<Omit<EntityType, SystemDefinedProperties>> & {
    title: string;
  };
};

export type ApiEntityTypeCreateResponse = {
  entityType: EntityTypeWithMetadata;
};

export default createAuthenticatedHandler<
  ApiEntityTypeCreateRequest,
  ApiEntityTypeCreateResponse
>()
  .use(bodyValidator("schema").isObject())
  .post(async (req, res) => {
    const { db, user } = req;
    const { schema } = req.body;

    // user is guaranteed to exist by isLoggedInMiddleware
    if (!user) {
      return res.status(401).json(formatErrors({ msg: "Unauthorized" }));
    }

    try {
      const dbRecord = await createEntityType(db, { schema, user });
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
