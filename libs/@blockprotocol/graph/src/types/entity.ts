import type {
  JsonObject as CoreJsonObject,
  JsonValue as CoreJsonValue,
} from "@blockprotocol/core";
import { BaseUri, VersionedUri } from "@blockprotocol/type-system/slim";

import { isOntologyTypeRecordId, Timestamp } from "../types.js";
import { Subgraph, SubgraphRootTypes } from "./subgraph.js";
import { GraphResolveDepths } from "./subgraph/graph-resolve-depths.js";

export type JsonObject = CoreJsonObject;
export type JsonValue = CoreJsonValue;

/** @todo - Consider branding these */
/** @todo - Add documentation for these if we keep them */
export type EntityId = string;
// This isn't necessary, it just _could_ provide greater clarity that this corresponds to an exact vertex and can be
// used in a direct lookup and not a search in the vertices
export type EntityRevisionId = Timestamp;
export type EntityVersion = string;

export type EntityRecordId = {
  baseId: EntityId;
  versionId: EntityVersion;
};

export const isEntityRecordId = (
  recordId: unknown,
): recordId is EntityRecordId => {
  return (
    recordId != null &&
    typeof recordId === "object" &&
    "baseId" in recordId &&
    "versionId" in recordId &&
    /** @todo - is it fine to just check that versionId is string, maybe timestamp if we want to lock it into being a
     *    timestamp?
     */
    !isOntologyTypeRecordId(recordId)
  );
};

/**
 * Entity Properties are JSON objects with `BaseUri`s as keys, _except_ when there is a Data Type of primitive type
 * `object` in which case the nested objects become plain `JsonObject`s
 */
export type EntityPropertyValue = JsonValue | EntityPropertiesObject;
export type EntityPropertiesObject = {
  [_: BaseUri]: EntityPropertyValue;
};

export type EntityMetadata = {
  recordId: EntityRecordId;
  entityTypeId: VersionedUri;
};

export type LinkData = {
  leftToRightOrder?: number;
  rightToLeftOrder?: number;
  leftEntityId: EntityId;
  rightEntityId: EntityId;
};

export type Entity<
  Properties extends EntityPropertiesObject | null = Record<
    BaseUri,
    EntityPropertyValue
  >,
> = {
  metadata: EntityMetadata;
  linkData?: LinkData;
} & (Properties extends null ? {} : { properties: Properties });

export type LinkEntityAndRightEntity = {
  linkEntity: Entity;
  rightEntity: Entity;
};

export type CreateEntityData = {
  entityTypeId: VersionedUri;
  properties: EntityPropertiesObject;
  linkData?: LinkData;
};

export type GetEntityData = {
  entityId: EntityId;
  graphResolveDepths?: GraphResolveDepths;
};

export type UpdateEntityData = {
  entityId: EntityId;
  entityTypeId: VersionedUri;
  properties: EntityPropertiesObject;
} & Pick<LinkData, "leftToRightOrder" | "rightToLeftOrder">;

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
  graphResolveDepths?: GraphResolveDepths;
};

export type AggregateEntitiesResult<
  T extends Subgraph<SubgraphRootTypes["entity"]>,
> = {
  results: T;
  operation: AggregateOperationInput &
    Required<Pick<AggregateOperationInput, "pageNumber" | "itemsPerPage">> & {
      pageCount?: number | null;
      totalCount?: number | null;
    };
};

/**
 * A utility type that extracts the last segment of a string delimited by a separator
 */
type BeforeTrailingLast<
  CurrentString extends string,
  Separator extends string,
  PreviouslyExtractedSegment extends string = never,
> = CurrentString extends `${string}${Separator}${infer Segment}${Separator}`
  ? BeforeTrailingLast<`${Segment}${Separator}`, Separator, Segment>
  : PreviouslyExtractedSegment;

/**
 * A properties object where the URI keys have been replaced by the last segment of the URI
 * To experiment with in block building – might be useful in patterns to make block building easier.
 * @todo remove this if we settle on a pattern that doesn't benefit from it
 */
export type SimpleProperties<Properties extends EntityPropertiesObject> = {
  [Key in keyof Properties as BeforeTrailingLast<
    Extract<Key, string>,
    "/"
  >]: Properties[Key];
};
