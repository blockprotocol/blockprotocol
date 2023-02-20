import { MessageCallback, MessageReturn } from "@blockprotocol/core";

import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  CreateEntityData,
  DeleteEntityData,
  Entity,
  GetEntityData,
  UpdateEntityData,
} from "./entity";
import { UploadFileData, UploadFileReturn } from "./file";
import {
  AggregatePropertyTypesData,
  AggregatePropertyTypesResult,
  CreateEntityTypeData,
  CreatePropertyTypeData,
  EntityTypeWithMetadata,
  GetPropertyTypeData,
  PropertyTypeWithMetadata,
  UpdateEntityTypeData,
  UpdatePropertyTypeData,
} from "./ontology";
import {
  AggregateEntityTypesData,
  AggregateEntityTypesResult,
  GetEntityTypeData,
} from "./ontology/entity-type";
import {
  EntityRootType,
  EntityTypeRootType,
  EntityVertexId,
  PropertyTypeRootType,
  Subgraph,
} from "./subgraph";

export type BlockGraphProperties<
  Temporal extends boolean,
  RootEntity extends Entity<Temporal> = Entity<Temporal>,
> = {
  /**
   * The 'graph' object contains messages sent under the graph module from the app to the block.
   * They are sent on initialization and again when the application has new values to send.
   * One such message is 'graph.blockEntitySubgraph', which is a data entity fitting the block's schema (its type).
   * @see https://blockprotocol.org/docs/spec/graph-module#message-definitions for a full list
   */
  graph: {
    blockEntitySubgraph?: Subgraph<
      Temporal,
      {
        vertexId: EntityVertexId;
        element: RootEntity;
      }
    >;
    readonly?: boolean;
  };
};

export type BlockGraphMessageCallbacks<Temporal extends boolean> = {
  blockEntitySubgraph: MessageCallback<
    Subgraph<Temporal, EntityRootType<Temporal>>,
    null
  >;
  readonly: MessageCallback<boolean, null>;
};

export type GraphEmbedderMessages<
  Temporal extends boolean,
  Key extends keyof BlockGraphMessageCallbacks<Temporal> = keyof BlockGraphMessageCallbacks<Temporal>,
> = {
  [key in Key]: ({
    data,
    errors,
  }: Parameters<BlockGraphMessageCallbacks<Temporal>[key]>[0]) => ReturnType<
    BlockGraphMessageCallbacks<Temporal>[key]
  >;
};

export type CreateResourceError =
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "NOT_IMPLEMENTED";
export type ReadOrModifyResourceError =
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "NOT_IMPLEMENTED";

/**
 * @todo Generate these types from the JSON definition, to avoid manually keeping the JSON and types in sync
 */
export type GraphEmbedderMessageCallbacks<Temporal extends boolean> = {
  createEntity: MessageCallback<
    CreateEntityData,
    null,
    MessageReturn<Entity<Temporal>>,
    CreateResourceError
  >;
  updateEntity: MessageCallback<
    UpdateEntityData,
    null,
    MessageReturn<Entity<Temporal>>,
    ReadOrModifyResourceError
  >;
  deleteEntity: MessageCallback<
    DeleteEntityData,
    null,
    MessageReturn<true>,
    ReadOrModifyResourceError
  >;
  getEntity: MessageCallback<
    GetEntityData<boolean>,
    null,
    MessageReturn<Subgraph<Temporal, EntityRootType<Temporal>>>,
    ReadOrModifyResourceError
  >;
  aggregateEntities: MessageCallback<
    AggregateEntitiesData<boolean>,
    null,
    MessageReturn<
      AggregateEntitiesResult<
        Temporal,
        Subgraph<Temporal, EntityRootType<Temporal>>
      >
    >,
    ReadOrModifyResourceError
  >;
  createEntityType: MessageCallback<
    CreateEntityTypeData,
    null,
    MessageReturn<EntityTypeWithMetadata>,
    CreateResourceError
  >;
  updateEntityType: MessageCallback<
    UpdateEntityTypeData,
    null,
    MessageReturn<EntityTypeWithMetadata>,
    ReadOrModifyResourceError
  >;
  getEntityType: MessageCallback<
    GetEntityTypeData,
    null,
    MessageReturn<Subgraph<Temporal, EntityTypeRootType>>,
    ReadOrModifyResourceError
  >;
  aggregateEntityTypes: MessageCallback<
    AggregateEntityTypesData,
    null,
    MessageReturn<
      AggregateEntityTypesResult<Subgraph<Temporal, EntityTypeRootType>>
    >,
    ReadOrModifyResourceError
  >;
  createPropertyType: MessageCallback<
    CreatePropertyTypeData,
    null,
    MessageReturn<PropertyTypeWithMetadata>,
    CreateResourceError
  >;
  updatePropertyType: MessageCallback<
    UpdatePropertyTypeData,
    null,
    MessageReturn<PropertyTypeWithMetadata>,
    ReadOrModifyResourceError
  >;
  getPropertyType: MessageCallback<
    GetPropertyTypeData,
    null,
    MessageReturn<Subgraph<Temporal, PropertyTypeRootType>>,
    ReadOrModifyResourceError
  >;
  aggregatePropertyTypes: MessageCallback<
    AggregatePropertyTypesData,
    null,
    MessageReturn<AggregatePropertyTypesResult>,
    ReadOrModifyResourceError
  >;
  /** @todo - Reimplement linked aggregations */
  // createLinkedAggregation: MessageCallback<
  //   CreateLinkedAggregationData,
  //   null,
  //   MessageReturn<LinkedAggregationDefinition>,
  //   CreateResourceError
  // >;
  // updateLinkedAggregation: MessageCallback<
  //   UpdateLinkedAggregationData,
  //   null,
  //   MessageReturn<LinkedAggregationDefinition>,
  //   ReadOrModifyResourceError
  // >;
  // deleteLinkedAggregation: MessageCallback<
  //   DeleteLinkedAggregationData,
  //   null,
  //   MessageReturn<true>,
  //   ReadOrModifyResourceError
  // >;
  // getLinkedAggregation: MessageCallback<
  //   GetLinkedAggregationData,
  //   null,
  //   MessageReturn<LinkedAggregationDefinition>,
  //   ReadOrModifyResourceError
  // >;
  uploadFile: MessageCallback<
    UploadFileData,
    null,
    MessageReturn<UploadFileReturn>,
    CreateResourceError
  >;
};

export type GraphBlockMessages<
  Temporal extends boolean,
  Key extends keyof GraphEmbedderMessageCallbacks<Temporal> = keyof GraphEmbedderMessageCallbacks<Temporal>,
> = {
  [key in Key]: ({
    data,
    errors,
  }: Parameters<GraphEmbedderMessageCallbacks<Temporal>[key]>[0]) => ReturnType<
    GraphEmbedderMessageCallbacks<Temporal>[key]
  >;
};
