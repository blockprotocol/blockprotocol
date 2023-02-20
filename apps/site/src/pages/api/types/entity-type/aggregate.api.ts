import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import { query as queryValidator } from "express-validator";

import { createBaseHandler } from "../../../../lib/api/handler/base-handler";
import { getEntityTypes } from "./shared/db";

export type ApiAggregateEntityTypesQuery = {
  latestOnly?: boolean;
};

export type ApiAggregateEntityTypesResponse = {
  entityTypes: EntityTypeWithMetadata[];
};

export default createBaseHandler<
  ApiAggregateEntityTypesQuery,
  ApiAggregateEntityTypesResponse
>()
  .use(queryValidator("latestOnly").isBoolean())
  .get(async (req, res) => {
    const { db } = req;
    const { latestOnly } = req.query;

    const dbRecords = await getEntityTypes(db, {
      latestOnly: latestOnly === "true",
    });

    res.status(200).send({
      entityTypes: dbRecords.map((record) => record.entityTypeWithMetadata),
    });
  });
