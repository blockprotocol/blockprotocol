import { PropertyTypeWithMetadata } from "@blockprotocol/graph";
import { query as queryValidator } from "express-validator";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../../lib/api/handler/base-handler";
import { getPropertyTypes } from "./shared/db";

export type ApiQueryPropertyTypesQuery = {
  latestOnly?: boolean;
};

export type ApiQueryPropertyTypesResponse = {
  propertyTypes: PropertyTypeWithMetadata[];
};

export default createBaseHandler<
  ApiQueryPropertyTypesQuery,
  ApiQueryPropertyTypesResponse
>()
  .use(queryValidator("latestOnly").isBoolean())
  .get(async (req, res) => {
    const { db } = req;
    const { latestOnly } = req.query;

    const dbRecords = await getPropertyTypes(db, {
      latestOnly: latestOnly === "true",
    });

    res.status(200).send({
      propertyTypes: dbRecords.map((record) => record.propertyTypeWithMetadata),
    });
  })
  .handler(baseHandlerOptions);
