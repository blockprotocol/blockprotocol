import { EntityTypeWithMetadata } from "@blockprotocol/graph";

import { hardcodedTypes } from "../middleware.page/return-types-as-json/hardcoded-types";

export const linkEntityTypeId =
  hardcodedTypes[
    "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1"
  ].$id;

export const isLinkEntityType = (entityType: EntityTypeWithMetadata) =>
  !!entityType.schema.allOf?.some((parent) => parent.$ref === linkEntityTypeId);
