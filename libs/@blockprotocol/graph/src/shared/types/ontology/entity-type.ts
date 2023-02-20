import { EntityType, VersionedUri } from "@blockprotocol/type-system/slim";

import { AggregateOperationInput } from "../entity";
import { EntityTypeRootType, Subgraph } from "../subgraph";
import { OntologyElementMetadata } from "./metadata";

/**
 * @todo - Should we re-export this? Should the type-system package be an implementation detail of the graph module?
 *   Or should consumers import it directly? Also raises the question of if we should be re-exporting the functions.
 */
export type { EntityType };

export type EntityTypeWithMetadata = {
  schema: EntityType;
  metadata: OntologyElementMetadata;
};

export type AggregateEntityTypesData = {
  // @todo mention in spec or remove
  // include entities that are used by, but don't belong to, the specified account
  includeOtherTypesInUse?: boolean | null;
  operation?: Omit<AggregateOperationInput, "entityTypeId"> | null;
};

export type AggregateEntityTypesResult<
  T extends Subgraph<boolean, EntityTypeRootType>,
> = {
  results: T[];
  operation: AggregateOperationInput;
};

export type GetEntityTypeData = {
  entityTypeId: VersionedUri;
};

export type CreateEntityTypeData = {
  entityType: Omit<EntityType, "$id" | "additionalProperties">;
};

export type UpdateEntityTypeData = {
  entityTypeId: VersionedUri;
  entityType: Omit<EntityType, "$id" | "additionalProperties">;
};
