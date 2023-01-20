import { MessageCallback } from "@blockprotocol/core";

import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  CreateEntityData,
  DeleteEntityData,
  Entity,
  EntityRecordId,
  GetEntityData,
  UpdateEntityData,
} from "./entity.js";
import { UploadFileData, UploadFileReturn } from "./file.js";
import {
  AggregateEntityTypesData,
  AggregateEntityTypesResult,
  GetEntityTypeData,
} from "./ontology/entity-type.js";
import { Subgraph, SubgraphRootTypes } from "./subgraph.js";

export type BlockGraphProperties<RootEntity extends Entity = Entity> = {
  /**
   * The 'graph' object contains messages sent under the graph service from the app to the block.
   * They are sent on initialization and again when the application has new values to send.
   * One such message is 'graph.blockEntity', which is a data entity fitting the block's schema (its type).
   * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions for a full list
   */
  graph: {
    blockEntitySubgraph?: Subgraph<{
      recordId: EntityRecordId;
      element: RootEntity;
    }>;
    readonly?: boolean;
  };
};

export type BlockGraphMessageCallbacks = {
  blockEntitySubgraph: MessageCallback<
    Subgraph<SubgraphRootTypes["entity"]>,
    null
  >;
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
    Subgraph<SubgraphRootTypes["entity"]>,
    ReadOrModifyResourceError
  >;
  aggregateEntities: MessageCallback<
    AggregateEntitiesData,
    null,
    AggregateEntitiesResult<Subgraph<SubgraphRootTypes["entity"]>>,
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
    Subgraph<SubgraphRootTypes["entityType"]>,
    ReadOrModifyResourceError
  >;
  aggregateEntityTypes: MessageCallback<
    AggregateEntityTypesData,
    null,
    AggregateEntityTypesResult<Subgraph<SubgraphRootTypes["entityType"]>>,
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
  Key extends keyof EmbedderGraphMessageCallbacks = keyof EmbedderGraphMessageCallbacks,
> = {
  [key in Key]: ({
    data,
    errors,
  }: Parameters<EmbedderGraphMessageCallbacks[key]>[0]) => ReturnType<
    EmbedderGraphMessageCallbacks[key]
  >;
};
