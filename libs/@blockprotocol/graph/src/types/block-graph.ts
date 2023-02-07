import { MessageCallback, MessageReturn } from "@blockprotocol/core";

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
  CreateEntityTypeData,
  DeleteEntityTypeData,
  EntityTypeWithMetadata,
  UpdateEntityTypeData,
} from "./ontology.js";
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
    GetEntityData<Temporal>,
    null,
    MessageReturn<Subgraph<Temporal, EntityRootType<Temporal>>>,
    ReadOrModifyResourceError
  >;
  aggregateEntities: MessageCallback<
    AggregateEntitiesData<Temporal>,
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
  deleteEntityType: MessageCallback<
    DeleteEntityTypeData,
    null,
    MessageReturn<true>,
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
