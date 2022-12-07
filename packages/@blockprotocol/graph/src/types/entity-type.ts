import { EntityType, VersionedUri } from "@blockprotocol/type-system/slim";

import { AggregateOperationInput } from "./entity";

export type { EntityType };

export type CreateEntityTypeData = {
  entityType: EntityType;
};

export type AggregateEntityTypesData = {
  // @todo mention in spec or remove
  // include entities that are used by, but don't belong to, the specified account
  includeOtherTypesInUse?: boolean | null;
  operation?: Omit<AggregateOperationInput, "entityTypeId"> | null;
};

export type GetEntityTypeData = {
  entityTypeId: VersionedUri;
};

export type UpdateEntityTypeData = {
  entityTypeId: VersionedUri;
  entityType: Omit<EntityType, "$id">;
};

export type DeleteEntityTypeData = {
  entityTypeId: VersionedUri;
};
