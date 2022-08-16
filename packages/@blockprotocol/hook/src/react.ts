import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { HookBlockHandler, HookEmbedderHandler } from "./index.js";

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

type Hook<T extends HTMLElement> = {
  id: string | null;
  teardown: (() => Promise<void>) | null;
  params: {
    service: HookBlockHandler | null;
    node: T;
    type: string;
    path: string;
  };
};

export const useHook = <T extends HTMLElement>(
  service: HookBlockHandler | null,
  ref: RefObject<T | null | void>,
  type: string,
  path: string,
  fallback: (node: T) => void | (() => void),
) => {
  const hookRef = useRef<null | Hook<T>>(null);
  const [, setError] = useState();

  const fallbackRef = useRef(fallback);

  useLayoutEffect(() => {
    fallbackRef.current = fallback;
  });

  useLayoutEffect(() => {
    return () => {
      hookRef.current?.teardown?.().catch((err) => {
        setError(() => {
          throw err;
        });
      });
    };
  }, []);

  useLayoutEffect(() => {
    const existingHook = hookRef.current?.params;
    const node = ref.current;

    if (
      existingHook &&
      existingHook.service === service &&
      existingHook.node === node &&
      existingHook.path === path &&
      existingHook.type === type
    ) {
      return;
    }

    const teardownPromise =
      hookRef.current?.teardown?.().catch() ?? Promise.resolve();

    if (node && service) {
      const controller = new AbortController();

      const reuseId =
        existingHook &&
        existingHook.service === service &&
        existingHook.path === path &&
        existingHook.type === type;

      const hook: Hook<T> = {
        id: reuseId ? hookRef.current?.id ?? null : null,
        params: {
          service,
          type,
          path,
          node,
        },
        teardown: async () => {
          controller.abort();

          if (hook.id) {
            try {
              hook.id = null;
              if (hookRef.current === hook) {
                hookRef.current = null;
              }

              if (!service.destroyed) {
                await service.hook({
                  data: {
                    hookId: hook.id,
                    path,
                    type,
                    node: null,
                  },
                });
              }
            } catch (err) {
              setError(() => {
                throw err;
              });
            }
          }
        },
      };

      hookRef.current = hook;

      teardownPromise
        .then(() => {
          if (service.destroyed) {
            return;
          }

          return service
            .hook({
              data: {
                hookId: hook.id,
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
                    response.errors[0]?.code === "NOT_IMPLEMENTED"
                  ) {
                    const teardown = fallbackRef.current(node);

                    hook.teardown = async () => {
                      controller.abort();
                      teardown?.();
                    };
                  } else {
                    // eslint-disable-next-line no-console
                    console.error(response.errors);
                    throw new Error("Unknown error in hook");
                  }
                } else if (response.data) {
                  hook.id = response.data.hookId;
                }
              }
            });
        })
        .catch((err) => {
          setError(() => {
            throw err;
          });
        });
    } else {
      hookRef.current = null;
    }
  });
};
