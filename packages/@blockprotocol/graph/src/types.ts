import { MessageCallback } from "@blockprotocol/core";

import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  AggregateOperationInput,
  CreateEntityData,
  DeleteEntityData,
  Entity,
  GetEntityData,
  UpdateEntityData,
} from "./types/entity";

export * from "./types/entity";

// ------------------------ OTHER FUNCTIONS --------------------------- //

export type FileMediaType = "image" | "video";

export type UploadFileData = {
  file?: File | null;
  url?: string | null;
  mediaType: FileMediaType;
};

export type UploadFileReturn = {
  entityId: string;
  url: string;
  mediaType: FileMediaType;
};

// ----------------------------- LINKS -------------------------------- //

export type Link = {
  linkId: string;
  sourceEntityId: string;
  destinationEntityId: string;
  index?: number | null;
  path: string;
};

export type LinkGroup = {
  sourceEntityId: string;
  path: string;
  links: Link[];
};

export type GetLinkData = {
  linkId: string;
};

export type CreateLinkData = Omit<Link, "linkId">;

export type UpdateLinkData = {
  linkId: string;
  data: Pick<Link, "index">;
};

export type DeleteLinkData = {
  linkId: string;
};

// ---------------------- LINKED AGGREGATIONS ------------------------- //

export type LinkedAggregationDefinition = {
  aggregationId: string;
  sourceEntityId: string;
  path: string;
  operation: AggregateOperationInput;
};

export type LinkedAggregation = Omit<LinkedAggregationDefinition, "operation"> &
  AggregateEntitiesResult<Entity>;

export type GetLinkedAggregationData = {
  aggregationId: string;
};

export type CreateLinkedAggregationData = Omit<
  LinkedAggregationDefinition,
  "aggregationId"
>;

export type UpdateLinkedAggregationData = {
  aggregationId: string;
  operation: LinkedAggregationDefinition["operation"];
};

export type DeleteLinkedAggregationData = {
  aggregationId: string;
};

// ------------------------- ENTITY TYPES ----------------------------- //

export type EntityType = {
  entityTypeId: string; // @todo consider removing this and just using $id, the URI
  schema: {
    $id: string;
    $schema: string;
    title: string;
    type: string;
    labelProperty?: string;
    [key: string]: unknown;
  };
};

export type CreateEntityTypeData = {
  schema: EntityType["schema"];
};

export type AggregateEntityTypesData = {
  // @todo mention in spec or remove
  // include entities that are used by, but don't belong to, the specified account
  includeOtherTypesInUse?: boolean | null;
  operation?: Omit<AggregateOperationInput, "entityTypeId"> | null;
};

export type GetEntityTypeData = {
  entityTypeId: string;
};

export type UpdateEntityTypeData = {
  entityTypeId: string;
  schema: EntityType["schema"];
};

export type DeleteEntityTypeData = {
  entityTypeId: string;
};

// -------------------------- BLOCK GRAPH -------------------------- //

export type LinkedAggregations = LinkedAggregation[];
export type LinkedEntities = Entity[];
export type LinkGroups = LinkGroup[];

export type BlockGraph = {
  depth: number;
  linkedEntities: LinkedEntities;
  linkGroups: LinkGroups;
};

export type BlockGraphProperties<
  BlockEntityProperties extends Record<string, unknown> | null,
> = {
  /**
   * The 'graph' object contains messages sent under the graph service from the app to the block.
   * They are sent on initialization and again when the application has new values to send.
   * One such message is 'graph.blockEntity', which is a data entity fitting the block's schema (its type).
   * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions for a full list
   */
  graph: {
    blockGraph?: BlockGraph;
    entityTypes?: EntityType[];
    linkedAggregations?: LinkedAggregations;
    readonly?: boolean;
  } & (BlockEntityProperties extends null
    ? { blockEntity?: Entity }
    : { blockEntity: Entity<BlockEntityProperties> });
};

export type BlockGraphMessageCallbacks = {
  blockEntity: MessageCallback<Entity, null>;
  blockGraph: MessageCallback<BlockGraph, null>;
  entityTypes: MessageCallback<EntityType[], null>;
  linkedAggregations: MessageCallback<LinkedAggregations, null>;
  readonly: MessageCallback<boolean, null>;
};

export type EmbedderGraphMessages<
  Key extends keyof BlockGraphMessageCallbacks = keyof BlockGraphMessageCallbacks,
> = {
  [key in Key]: ({
    data,
    errors,
  }: Parameters<BlockGraphMessageCallbacks[key]>[0]) => ReturnType<
    BlockGraphMessageCallbacks[key]
  >;
};

export type CreateResourceError = "FORBIDDEN" | "INVALID_INPUT";
export type ReadOrModifyResourceError =
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "NOT_FOUND";

/**
 * @todo Generate these types from the JSON definition, to avoid manually keeping the JSON and types in sync
 */
export type EmbedderGraphMessageCallbacks = {
  createEntity: MessageCallback<
    CreateEntityData,
    null,
    Entity,
    CreateResourceError
  >;
  updateEntity: MessageCallback<
    UpdateEntityData,
    null,
    Entity,
    ReadOrModifyResourceError
  >;
  deleteEntity: MessageCallback<
    DeleteEntityData,
    null,
    true,
    ReadOrModifyResourceError
  >;
  getEntity: MessageCallback<
    GetEntityData,
    null,
    Entity,
    ReadOrModifyResourceError
  >;
  aggregateEntities: MessageCallback<
    AggregateEntitiesData,
    null,
    AggregateEntitiesResult<Entity>,
    ReadOrModifyResourceError
  >;
  createEntityType: MessageCallback<
    CreateEntityTypeData,
    null,
    EntityType,
    CreateResourceError
  >;
  updateEntityType: MessageCallback<
    UpdateEntityTypeData,
    null,
    EntityType,
    ReadOrModifyResourceError
  >;
  deleteEntityType: MessageCallback<
    DeleteEntityTypeData,
    null,
    true,
    ReadOrModifyResourceError
  >;
  getEntityType: MessageCallback<
    GetEntityTypeData,
    null,
    EntityType,
    ReadOrModifyResourceError
  >;
  aggregateEntityTypes: MessageCallback<
    AggregateEntityTypesData,
    null,
    AggregateEntitiesResult<EntityType>,
    ReadOrModifyResourceError
  >;
  createLink: MessageCallback<CreateLinkData, null, Link, CreateResourceError>;
  updateLink: MessageCallback<
    UpdateLinkData,
    null,
    Link,
    ReadOrModifyResourceError
  >;
  deleteLink: MessageCallback<
    DeleteLinkData,
    null,
    true,
    ReadOrModifyResourceError
  >;
  getLink: MessageCallback<GetLinkData, null, Link, ReadOrModifyResourceError>;
  createLinkedAggregation: MessageCallback<
    CreateLinkedAggregationData,
    null,
    LinkedAggregationDefinition,
    CreateResourceError
  >;
  updateLinkedAggregation: MessageCallback<
    UpdateLinkedAggregationData,
    null,
    LinkedAggregationDefinition,
    ReadOrModifyResourceError
  >;
  deleteLinkedAggregation: MessageCallback<
    DeleteLinkedAggregationData,
    null,
    true,
    ReadOrModifyResourceError
  >;
  getLinkedAggregation: MessageCallback<
    GetLinkedAggregationData,
    null,
    LinkedAggregationDefinition,
    ReadOrModifyResourceError
  >;
  uploadFile: MessageCallback<
    UploadFileData,
    null,
    UploadFileReturn,
    CreateResourceError
  >;
};

export type BlockGraphMessages<
  Key extends keyof EmbedderGraphMessageCallbacks = keyof EmbedderGraphMessageCallbacks,
> = {
  [key in Key]: ({
    data,
    errors,
  }: Parameters<EmbedderGraphMessageCallbacks[key]>[0]) => ReturnType<
    EmbedderGraphMessageCallbacks[key]
  >;
};
