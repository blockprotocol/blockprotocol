import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { HookBlockHandler, HookEmbedderHandler } from "./index";

const useHookServiceConstructor = <
  T extends typeof HookBlockHandler | typeof HookEmbedderHandler,
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

  const [hookService, setHookService] = useState<
    | (T extends typeof HookBlockHandler
        ? HookBlockHandler
        : HookEmbedderHandler)
    | null
  >(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- will not loop & we don't want to reconstruct on other args
  useEffect(() => {
    if (ref.current === previousRef.current) {
      return;
    }

    if (previousRef.current) {
      hookService?.destroy();
    }

    previousRef.current = ref.current;

    if (ref.current) {
      setHookService(
        new Handler({
          element: ref.current,
          ...(constructorArgs as unknown as ConstructorParameters<T>), // @todo fix these casts
        }) as T extends typeof HookBlockHandler // @todo fix these casts
          ? HookBlockHandler
          : HookEmbedderHandler,
      );
    }
  });

  return { hookService };
};

/**
 * Create a HookBlockHandler instance, using a reference to an element in the
 * block.
 *
 * The hookService will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by
 * calling hookService.on("messageName", callback);
 */
export const useHookBlockService = (
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof HookBlockHandler>[0],
    "element"
  >,
): { hookService: HookBlockHandler | null } => {
  return useHookServiceConstructor({
    Handler: HookBlockHandler,
    constructorArgs,
    ref,
  });
};

/**
 * Create a HookBlockHandler instance, using a reference to an element in the
 * block.
 *
 * The hookService will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by
 * calling hookService.on("messageName", callback);
 */
export const useHookEmbedderService = (
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof HookEmbedderHandler>[0],
    "element"
  >,
): { hookService: HookEmbedderHandler | null } => {
  return useHookServiceConstructor({
    Handler: HookEmbedderHandler,
    ref,
    constructorArgs,
  });
};

export const useHookRef = <T extends HTMLElement>(
  service: HookBlockHandler | null,
  type: string,
  path: string,
  fallback: (node: T | null) => void,
) => {
  const hookId = useRef<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const fallbackRef = useRef(fallback);
  const [, setError] = useState();

  useLayoutEffect(() => {
    fallbackRef.current = fallback;
  });

  return useCallback(
    (node: T | null) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      service
        ?.hook({
          data: {
            hookId: hookId.current,
            node,
            type,
            path,
          },
        })
        .then((response) => {
          if (!controller.signal.aborted) {
            if (response.errors) {
              if (
                response.errors.length === 1 &&
                response.errors[0].code === "NOT_IMPLEMENTED"
              ) {
                fallbackRef.current(node);
              } else {
                // eslint-disable-next-line no-console
                console.error(response.errors);
                throw new Error("Unknown error in hook");
              }
            }
          }
        })
        .catch((err) => {
          setError(() => {
            throw err;
          });
        });
    },
    [path, service, type],
  );
};
