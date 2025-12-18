import { EntityTypeWithMetadata } from "@blockprotocol/graph";

import { hardcodedTypes } from "../middleware.page/hardcoded-types";

export const linkEntityTypeId =
  hardcodedTypes[
    "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1"
  ].$id;

export const isLinkEntityType = (entityType: EntityTypeWithMetadata) =>
  !!entityType.schema.allOf?.some(
    (parent: { $ref?: string }) => parent.$ref === linkEntityTypeId,
  );
