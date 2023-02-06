import { useServiceConstructor } from "@blockprotocol/core/react";
import {
  FunctionComponent,
  RefObject,
  useMemo,
} from "react";

import {
  BlockGraphProperties,
  Entity,
  EntityVertexId,
  GraphBlockHandler,
  GraphEmbedderHandler,
  LinkEntityAndRightEntity,
  Subgraph,
} from "./index.js";
import { getOutgoingLinkAndTargetEntities, getRoots } from "./stdlib.js";

export type BlockComponent<
  Temporal extends boolean,
  RootEntity extends Entity<Temporal> = Entity<Temporal>,
> = FunctionComponent<BlockGraphProperties<Temporal, RootEntity>>;

/**
 * Create a GraphBlockHandler instance, using a reference to an element in the block.
 *
 * The graphService will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by calling graphService.on("messageName", callback);
 */
export const useGraphBlockService = <Temporal extends boolean>(
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof GraphBlockHandler>[0],
    "element"
  >,
): { graphService: GraphBlockHandler<Temporal> } => ({
  graphService: useServiceConstructor({
    Handler: GraphBlockHandler,
    constructorArgs,
    ref,
  }),
});

/**
 * Create a GraphBlockHandler instance, using a reference to an element in the block.
 *
 * The graphService will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by:
 * 1. to register one, call graphService.on("messageName", callback);
 * 2. to register multiple, call graphService.registerCallbacks({ [messageName]: callback });
 */
export const useGraphEmbedderService = <Temporal extends boolean>(
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof GraphEmbedderHandler<Temporal>>[0],
    "element"
  >,
): { graphService: GraphEmbedderHandler<Temporal> } => ({
  graphService: useServiceConstructor({
    Handler: GraphEmbedderHandler,
    ref,
    constructorArgs,
  }),
});

export const useEntitySubgraph = <
  Temporal extends boolean,
  RootEntity extends Entity<Temporal>,
  RootEntityLinkedEntities extends LinkEntityAndRightEntity<Temporal>[],
>(
  entitySubgraph: Subgraph<
    Temporal,
    {
      vertexId: EntityVertexId;
      element: RootEntity;
    }
  >,
) => {
  return useMemo(() => {
    const rootEntity = getRoots(entitySubgraph)[0];
    if (!rootEntity) {
      throw new Error("Root entity not present in subgraph");
    }

    const linkedEntities = getOutgoingLinkAndTargetEntities<
      Temporal,
      RootEntityLinkedEntities
    >(entitySubgraph, rootEntity.metadata.recordId.entityId);

    return {
      rootEntity,
      linkedEntities,
    };
  }, [entitySubgraph]);
};
