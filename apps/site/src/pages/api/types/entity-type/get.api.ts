import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import { BaseUrl, VersionedUrl } from "@blockprotocol/type-system/slim";

import { createBaseHandler } from "../../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../../util/api";
import { getEntityType } from "./shared/db";

export type ApiEntityTypeByUriGetQuery = {
  baseUrl?: BaseUrl;
  versionedUrl?: VersionedUrl;
};

export type ApiEntityTypeByUriResponse = { entityType: EntityTypeWithMetadata };

export default createBaseHandler<null, ApiEntityTypeByUriResponse>().get(
  async (req, res) => {
    const { db } = req;
    const { baseUrl, versionedUrl } = req.query as ApiEntityTypeByUriGetQuery;

    const dbRecord = await getEntityType(db, { baseUrl, versionedUrl });

    if (!dbRecord) {
      return res.status(404).json(
        formatErrors({
          msg: "Cannot find entity type",
        }),
      );
    }

    res.status(200).send({ entityType: dbRecord.entityTypeWithMetadata });
  },
);
