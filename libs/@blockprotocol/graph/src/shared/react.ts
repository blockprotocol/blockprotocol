import { useModuleConstructor } from "@blockprotocol/core/react";
import { FunctionComponent, RefObject, useMemo } from "react";

import { GraphBlockHandler } from "./graph-block-handler";
import { GraphEmbedderHandler } from "./graph-embedder-handler";
import { getOutgoingLinkAndTargetEntities, getRoots } from "./stdlib.js";
import {
  BlockGraphProperties,
  Entity,
  EntityVertexId,
  LinkEntityAndRightEntity,
  Subgraph,
} from "./types";

export type BlockComponent<
  Temporal extends boolean,
  RootEntity extends Entity<Temporal> = Entity<Temporal>,
> = FunctionComponent<BlockGraphProperties<Temporal, RootEntity>>;

/**
 * Create a GraphBlockHandler instance, using a reference to an element in the block.
 *
 * The graphModule will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by calling graphModule.on("messageName", callback);
 */
export const useGraphBlockModule = <Temporal extends boolean>(
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof GraphBlockHandler>[0],
    "element"
  >,
): { graphModule: GraphBlockHandler<Temporal> } => ({
  graphModule: useModuleConstructor({
    Handler: GraphBlockHandler,
    constructorArgs,
    ref,
  }),
});

/**
 * Create a GraphBlockHandler instance, using a reference to an element in the block.
 *
 * The graphModule will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by:
 * 1. to register one, call graphModule.on("messageName", callback);
 * 2. to register multiple, call graphModule.registerCallbacks({ [messageName]: callback });
 */
export const useGraphEmbedderModule = <Temporal extends boolean>(
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof GraphEmbedderHandler<Temporal>>[0],
    "element"
  >,
): { graphModule: GraphEmbedderHandler<Temporal> } => ({
  graphModule: useModuleConstructor({
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
