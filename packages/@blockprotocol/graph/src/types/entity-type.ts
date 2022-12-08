import { EntityType, VersionedUri } from "@blockprotocol/type-system/slim";

import { AggregateOperationInput } from "./entity";

export type { EntityType };

export type AggregateEntityTypesData = {
  // @todo mention in spec or remove
  // include entities that are used by, but don't belong to, the specified account
  includeOtherTypesInUse?: boolean | null;
  operation?: Omit<AggregateOperationInput, "entityTypeId"> | null;
};

export type GetEntityTypeData = {
  entityTypeId: VersionedUri;
};

/** @todo - Add Type System mutation methods */
/* eslint-disable @typescript-eslint/no-unused-vars -- To be re-enabled when we add Type System mutation methods */

type CreateEntityTypeData = {
  entityType: EntityType;
};

type UpdateEntityTypeData = {
  entityTypeId: VersionedUri;
  entityType: Omit<EntityType, "$id">;
};

type DeleteEntityTypeData = {
  entityTypeId: VersionedUri;
};

/* eslint-enable @typescript-eslint/no-unused-vars */
