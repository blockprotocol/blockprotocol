import { PropertyType, PropertyTypeWithMetadata } from "@blockprotocol/graph";
import { VersionedUrl } from "@blockprotocol/type-system/slim";
import { body as bodyValidator } from "express-validator/src/middlewares/validation-chain-builders";

import { createAuthenticatedHandler } from "../../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../../util/api";
import { SystemDefinedProperties } from "../shared/constants";
import { updatePropertyType } from "./shared/db";

export type ApiPropertyTypeUpdateRequest = {
  versionedUrl: VersionedUrl;
  schema: Omit<PropertyType, SystemDefinedProperties>;
};

export type ApiPropertyTypeUpdateResponse = {
  propertyType: PropertyTypeWithMetadata;
};

export default createAuthenticatedHandler<
  ApiPropertyTypeUpdateRequest,
  ApiPropertyTypeUpdateResponse
>()
  .use(
    bodyValidator("schema").isObject(),
    bodyValidator("versionedUrl").isString().notEmpty(),
  )
  .put(async (req, res) => {
    const { db, user } = req;

    if (!user) {
      return res.status(401).json(
        formatErrors({
          msg: "You must be logged in to update a property type",
        }),
      );
    }

    const { versionedUrl, schema } = req.body;

    try {
      const dbRecord = await updatePropertyType(db, {
        versionedUrl,
        schema,
        user,
      });

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
