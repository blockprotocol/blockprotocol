import { PropertyTypeWithMetadata } from "@blockprotocol/graph";
import { BaseUri, VersionedUri } from "@blockprotocol/type-system/slim";

import { createBaseHandler } from "../../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../../util/api";
import { getPropertyType } from "./shared/db";

export type ApiPropertyTypeByUriGetQuery = {
  baseUri?: BaseUri;
  versionedUri?: VersionedUri;
};

export type ApiPropertyTypeByUriResponse = {
  propertyType: PropertyTypeWithMetadata;
};

export default createBaseHandler<null, ApiPropertyTypeByUriResponse>().get(
  async (req, res) => {
    const { db } = req;
    const { baseUri, versionedUri } = req.query as ApiPropertyTypeByUriGetQuery;

    const dbRecord = await getPropertyType(db, { baseUri, versionedUri });

    if (!dbRecord) {
      return res.status(404).json(
        formatErrors({
          msg: "Cannot find property type",
        }),
      );
    }

    res.status(200).send({ propertyType: dbRecord.propertyTypeWithMetadata });
  },
);
