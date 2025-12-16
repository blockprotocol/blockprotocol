import { PropertyTypeWithMetadata } from "@blockprotocol/graph";
import { PropertyType } from "@blockprotocol/type-system";
import { body as bodyValidator } from "express-validator";

import { createAuthenticatedHandler } from "../../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../../util/api";
import { SystemDefinedProperties } from "../shared/constants";
import { createPropertyType } from "./shared/db";

export type ApiPropertyTypeCreateRequest = {
  schema: Partial<Omit<PropertyType, SystemDefinedProperties>> &
    Required<Pick<PropertyType, "title" | "oneOf">>;
};

export type ApiPropertyTypeCreateResponse = {
  propertyType: PropertyTypeWithMetadata;
};

export default createAuthenticatedHandler<
  ApiPropertyTypeCreateRequest,
  ApiPropertyTypeCreateResponse
>()
  .use(bodyValidator("schema").isObject())
  .post(async (req, res) => {
    const { db, user } = req;
    const { schema } = req.body;

    try {
      const dbRecord = await createPropertyType(db, { schema, user });
      return res
        .status(200)
        .json({ propertyType: dbRecord.propertyTypeWithMetadata });
    } catch (err) {
      return res.status(400).json(
        formatErrors({
          msg: err instanceof Error ? err.message : "unknown error",
        }),
      );
    }
  })
  .handler(baseHandlerOptions);
