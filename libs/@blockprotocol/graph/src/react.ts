import {
  FunctionComponent,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
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

export type BlockComponent<RootEntity extends Entity = Entity> =
  FunctionComponent<BlockGraphProperties<RootEntity>>;

const useGraphServiceConstructor = <
  T extends typeof GraphBlockHandler | typeof GraphEmbedderHandler,
>({
  Handler,
  constructorArgs,
  ref,
}: {
  Handler: T;
  constructorArgs?: Omit<ConstructorParameters<T>[0], "element">;
  ref: RefObject<HTMLElement>;
}) => {
  const previousRef = useRef<HTMLElement | null>(null);

  const [graphService, setGraphService] = useState<
    | (T extends typeof GraphBlockHandler
        ? GraphBlockHandler
        : GraphEmbedderHandler)
    | null
  >(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- will not loop & we don't want to reconstruct on other args
  useEffect(() => {
    if (ref.current === previousRef.current) {
      return;
    }

    if (previousRef.current) {
      graphService?.destroy();
    }

    previousRef.current = ref.current;

    if (ref.current) {
      setGraphService(
        new Handler({
          element: ref.current,
          ...(constructorArgs as unknown as ConstructorParameters<T>), // @todo fix these casts
        }) as T extends typeof GraphBlockHandler // @todo fix these casts
          ? GraphBlockHandler
          : GraphEmbedderHandler,
      );
    }
  });

  return { graphService };
};

/**
 * Create a GraphBlockHandler instance, using a reference to an element in the block.
 *
 * The graphService will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by calling graphService.on("messageName", callback);
 */
export const useGraphBlockService = (
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof GraphBlockHandler>[0],
    "element"
  >,
): { graphService: GraphBlockHandler | null } => {
  return useGraphServiceConstructor({
    Handler: GraphBlockHandler,
    constructorArgs,
    ref,
  });
};

/**
 * Create a GraphBlockHandler instance, using a reference to an element in the block.
 *
 * The graphService will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by:
 * 1. to register one, call graphService.on("messageName", callback);
 * 2. to register multiple, call graphService.registerCallbacks({ [messageName]: callback });
 */
export const useGraphEmbedderService = (
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof GraphEmbedderHandler>[0],
    "element"
  >,
): { graphService: GraphEmbedderHandler | null } => {
  return useGraphServiceConstructor({
    Handler: GraphEmbedderHandler,
    ref,
    constructorArgs,
  });
};

export const useEntitySubgraph = <
  RootEntity extends Entity,
  RootEntityLinkedEntities extends LinkEntityAndRightEntity[],
>(
  entitySubgraph: Subgraph<{
    vertexId: EntityVertexId;
    element: RootEntity;
  }>,
) => {
  return useMemo(() => {
    const rootEntity = getRoots(entitySubgraph)[0];
    if (!rootEntity) {
      throw new Error("Root entity not present in subgraph");
    }

    const linkedEntities =
      getOutgoingLinkAndTargetEntities<RootEntityLinkedEntities>(
        entitySubgraph,
        rootEntity.metadata.recordId.entityId,
      );

    return {
      rootEntity,
      linkedEntities,
    };
  }, [entitySubgraph]);
};
