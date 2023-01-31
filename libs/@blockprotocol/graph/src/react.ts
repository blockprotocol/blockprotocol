import {
  RefObject,
  useLayoutEffect,
  useRef,
  useState,
  VoidFunctionComponent,
} from "react";

import {
  BlockGraphProperties,
  GraphBlockHandler,
  GraphEmbedderHandler,
} from "./index.js";

export type BlockComponent<
  Properties extends Record<string, unknown> | null = null,
> = VoidFunctionComponent<BlockGraphProperties<Properties>>;

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
  const initialisedRef = useRef(false);

  const [graphService, setGraphService] = useState<
    T extends typeof GraphBlockHandler
      ? GraphBlockHandler
      : GraphEmbedderHandler
  >(
    () =>
      new Handler(constructorArgs ?? {}) as T extends typeof GraphBlockHandler // @todo fix these casts
        ? GraphBlockHandler
        : GraphEmbedderHandler,
  );

  const previousCallbacks = useRef<
    ConstructorParameters<T>[0]["callbacks"] | null
  >(null);

  useLayoutEffect(() => {
    if (previousCallbacks.current) {
      graphService.removeCallbacks(previousCallbacks.current);
    }

    previousCallbacks.current = constructorArgs?.callbacks ?? null;

    if (constructorArgs?.callbacks) {
      graphService.registerCallbacks(constructorArgs.callbacks);
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- will not loop & we don't want to reconstruct on other args
  useLayoutEffect(() => {
    if (ref.current === previousRef.current) {
      return;
    }

    if (previousRef.current) {
      graphService.destroy();
    }

    previousRef.current = ref.current;

    if (ref.current) {
      if (!initialisedRef.current) {
        graphService.initialize(ref.current);
      } else {
        setGraphService(
          new Handler({
            element: ref.current,
            ...(constructorArgs as unknown as ConstructorParameters<T>), // @todo fix these casts
          }) as T extends typeof GraphBlockHandler // @todo fix these casts
            ? GraphBlockHandler
            : GraphEmbedderHandler,
        );
      }

      initialisedRef.current = true;
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
): { graphService: GraphBlockHandler } => {
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
): { graphService: GraphEmbedderHandler } => {
  return useGraphServiceConstructor({
    Handler: GraphEmbedderHandler,
    ref,
    constructorArgs,
  });
};
