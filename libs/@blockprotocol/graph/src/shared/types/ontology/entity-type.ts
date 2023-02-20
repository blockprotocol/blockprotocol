import { EntityType, VersionedUri } from "@blockprotocol/type-system/slim";

import { AggregateOperationInput } from "../entity.js";
import { EntityTypeRootType, Subgraph } from "../subgraph.js";
import { OntologyElementMetadata } from "./metadata.js";

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

type SystemDefinedEntityTypeProperties =
  | "$id"
  | "additionalProperties"
  | "kind"
  | "type";

export type CreateEntityTypeData = {
  entityType: Omit<EntityType, SystemDefinedEntityTypeProperties>;
};

export type UpdateEntityTypeData = {
  entityTypeId: VersionedUri;
  entityType: Omit<EntityType, SystemDefinedEntityTypeProperties>;
};
