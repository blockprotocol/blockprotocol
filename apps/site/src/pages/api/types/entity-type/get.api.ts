import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import { BaseUri, VersionedUri } from "@blockprotocol/type-system/slim";

import { createBaseHandler } from "../../../../lib/api/handler/base-handler";
import { formatErrors } from "../../../../util/api";
import { getEntityType } from "./shared/db";

export type ApiEntityTypeByUriGetQuery = {
  baseUri?: BaseUri;
  versionedUri?: VersionedUri;
};

export type ApiEntityTypeByUriResponse = { entityType: EntityTypeWithMetadata };

export default createBaseHandler<null, ApiEntityTypeByUriResponse>().get(
  async (req, res) => {
    const { db } = req;
    const { baseUri, versionedUri } = req.query as ApiEntityTypeByUriGetQuery;

    const dbRecord = await getEntityType(db, { baseUri, versionedUri });

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
