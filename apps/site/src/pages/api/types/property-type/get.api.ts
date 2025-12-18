import { PropertyTypeWithMetadata } from "@blockprotocol/graph";
import { BaseUrl, VersionedUrl } from "@blockprotocol/type-system/slim";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../../util/api";
import { getPropertyType } from "./shared/db";

export type ApiPropertyTypeByUrlGetQuery = {
  baseUrl?: BaseUrl;
  versionedUrl?: VersionedUrl;
};

export type ApiPropertyTypeByUrlResponse = {
  propertyType: PropertyTypeWithMetadata;
};

export default createBaseHandler<null, ApiPropertyTypeByUrlResponse>()
  .get(async (req, res) => {
    const { db } = req;
    const { baseUrl, versionedUrl } = req.query as ApiPropertyTypeByUrlGetQuery;

    const dbRecord = await getPropertyType(db, { baseUrl, versionedUrl });

    if (!dbRecord) {
      return res.status(404).json(
        formatErrors({
          msg: "Cannot find property type",
        }),
      );
    }

    res.status(200).send({ propertyType: dbRecord.propertyTypeWithMetadata });
  })
  .handler(baseHandlerOptions);
