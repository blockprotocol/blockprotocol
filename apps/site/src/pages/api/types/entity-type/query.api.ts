import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import { query as queryValidator } from "express-validator";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../../lib/api/handler/base-handler";
import { getEntityTypes } from "./shared/db";

export type ApiQueryEntityTypesQuery = {
  latestOnly?: boolean;
};

export type ApiQueryEntityTypesResponse = {
  entityTypes: EntityTypeWithMetadata[];
};

export default createBaseHandler<
  ApiQueryEntityTypesQuery,
  ApiQueryEntityTypesResponse
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
  })
  .handler(baseHandlerOptions);
