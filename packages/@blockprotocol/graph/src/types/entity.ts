import { UnknownRecord } from "@blockprotocol/core";
import { VersionedUri } from "@blockprotocol/type-system/slim";

import { CreateLinkData, EntityType } from "../types";

/** @todo - Consider branding this */
export type EntityId = string;

export type Entity<
  Properties extends Record<string, unknown> | null = Record<string, unknown>,
> = {
  entityId: EntityId;
  entityTypeId?: VersionedUri;
} & (Properties extends null ? {} : { properties: Properties });

export type CreateEntityData = {
  entityTypeId: VersionedUri;
  properties: UnknownRecord;
  links?: Omit<
    CreateLinkData,
    "sourceAccountId" | "sourceEntityId" | "sourceEntityTypeId"
  >[];
};

export type GetEntityData = {
  entityId: EntityId;
};

export type UpdateEntityData = {
  entityId: EntityId;
  properties: UnknownRecord;
};

export type DeleteEntityData = {
  entityId: EntityId;
};

export type FilterOperatorType =
  | FilterOperatorRequiringValue
  | FilterOperatorWithoutValue;

export type FilterOperatorWithoutValue = "IS_EMPTY" | "IS_NOT_EMPTY";

export type FilterOperatorRequiringValue =
  | "CONTAINS"
  | "DOES_NOT_CONTAIN"
  | "IS"
  | "IS_NOT"
  | "STARTS_WITH"
  | "ENDS_WITH";

export type MultiFilterOperatorType = "AND" | "OR";

export type MultiFilter = {
  filters: (
    | {
        field: string;
        operator: FilterOperatorRequiringValue;
        value: string;
      }
    | { field: string; operator: FilterOperatorWithoutValue }
  )[];
  operator: MultiFilterOperatorType;
};

export type Sort = {
  field: string;
  desc?: boolean | undefined | null;
};

export type MultiSort = Sort[];

export type AggregateOperationInput = {
  entityTypeId?: VersionedUri | null;
  pageNumber?: number | null;
  itemsPerPage?: number | null;
  multiSort?: MultiSort | null;
  multiFilter?: MultiFilter | null;
};

export type AggregateEntitiesData = {
  operation: AggregateOperationInput;
};

export type AggregateEntitiesResult<T extends Entity | EntityType> = {
  results: T[];
  operation: AggregateOperationInput &
    Required<Pick<AggregateOperationInput, "pageNumber" | "itemsPerPage">> & {
      pageCount?: number | null;
      totalCount?: number | null;
    };
};
