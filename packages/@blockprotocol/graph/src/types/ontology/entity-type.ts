import { EntityType, VersionedUri } from "@blockprotocol/type-system/slim";

import { AggregateOperationInput } from "../entity";
import { Subgraph, SubgraphRootTypes } from "../subgraph";
import { OntologyElementMetadata } from "./metadata";

/**
 * @todo - Should we re-export this? Should the type-system package be an implementation detail of the graph service?
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
  T extends Subgraph<SubgraphRootTypes["entityType"]>,
> = {
  results: T[];
  operation: AggregateOperationInput &
    Required<Pick<AggregateOperationInput, "pageNumber" | "itemsPerPage">> & {
      pageCount?: number | null;
      totalCount?: number | null;
    };
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
