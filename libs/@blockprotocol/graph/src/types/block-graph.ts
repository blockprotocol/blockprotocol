import { MessageCallback } from "@blockprotocol/core";

import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  CreateEntityData,
  DeleteEntityData,
  Entity,
  GetEntityData,
  UpdateEntityData,
} from "./entity.js";
import { UploadFileData, UploadFileReturn } from "./file.js";
import {
  AggregateEntityTypesData,
  AggregateEntityTypesResult,
  GetEntityTypeData,
} from "./ontology/entity-type.js";
import {
  EntityRootType,
  EntityTypeRootType,
  EntityVertexId,
  Subgraph,
} from "./subgraph.js";

export type BlockGraphProperties<
  Temporal extends boolean,
  RootEntity extends Entity<Temporal> = Entity<Temporal>,
> = {
  /**
   * The 'graph' object contains messages sent under the graph service from the app to the block.
   * They are sent on initialization and again when the application has new values to send.
   * One such message is 'graph.blockEntity', which is a data entity fitting the block's schema (its type).
   * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions for a full list
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

export type EmbedderGraphMessages<
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
export type EmbedderGraphMessageCallbacks<Temporal extends boolean> = {
  createEntity: MessageCallback<
    CreateEntityData,
    null,
    Entity<Temporal>,
    CreateResourceError
  >;
  updateEntity: MessageCallback<
    UpdateEntityData,
    null,
    Entity<Temporal>,
    ReadOrModifyResourceError
  >;
  deleteEntity: MessageCallback<
    DeleteEntityData,
    null,
    true,
    ReadOrModifyResourceError
  >;
  getEntity: MessageCallback<
    GetEntityData<Temporal>,
    null,
    Subgraph<Temporal, EntityRootType<Temporal>>,
    ReadOrModifyResourceError
  >;
  aggregateEntities: MessageCallback<
    AggregateEntitiesData<Temporal>,
    null,
    AggregateEntitiesResult<
      Temporal,
      Subgraph<Temporal, EntityRootType<Temporal>>
    >,
    ReadOrModifyResourceError
  >;
  /** @todo - Add Type System mutation methods */
  // createEntityType: MessageCallback<
  //   CreateEntityTypeData,
  //   null,
  //   EntityType,
  //   CreateResourceError
  // >;
  // updateEntityType: MessageCallback<
  //   UpdateEntityTypeData,
  //   null,
  //   EntityType,
  //   ReadOrModifyResourceError
  // >;
  // deleteEntityType: MessageCallback<
  //   DeleteEntityTypeData,
  //   null,
  //   true,
  //   ReadOrModifyResourceError
  // >;
  getEntityType: MessageCallback<
    GetEntityTypeData,
    null,
    Subgraph<Temporal, EntityTypeRootType>,
    ReadOrModifyResourceError
  >;
  aggregateEntityTypes: MessageCallback<
    AggregateEntityTypesData,
    null,
    AggregateEntityTypesResult<Subgraph<Temporal, EntityTypeRootType>>,
    ReadOrModifyResourceError
  >;
  /** @todo - Reimplement linked aggregations */
  // createLinkedAggregation: MessageCallback<
  //   CreateLinkedAggregationData,
  //   null,
  //   LinkedAggregationDefinition,
  //   CreateResourceError
  // >;
  // updateLinkedAggregation: MessageCallback<
  //   UpdateLinkedAggregationData,
  //   null,
  //   LinkedAggregationDefinition,
  //   ReadOrModifyResourceError
  // >;
  // deleteLinkedAggregation: MessageCallback<
  //   DeleteLinkedAggregationData,
  //   null,
  //   true,
  //   ReadOrModifyResourceError
  // >;
  // getLinkedAggregation: MessageCallback<
  //   GetLinkedAggregationData,
  //   null,
  //   LinkedAggregationDefinition,
  //   ReadOrModifyResourceError
  // >;
  uploadFile: MessageCallback<
    UploadFileData,
    null,
    UploadFileReturn,
    CreateResourceError
  >;
};

export type BlockGraphMessages<
  Temporal extends boolean,
  Key extends keyof EmbedderGraphMessageCallbacks<Temporal> = keyof EmbedderGraphMessageCallbacks<Temporal>,
> = {
  [key in Key]: ({
    data,
    errors,
  }: Parameters<EmbedderGraphMessageCallbacks<Temporal>[key]>[0]) => ReturnType<
    EmbedderGraphMessageCallbacks<Temporal>[key]
  >;
};
