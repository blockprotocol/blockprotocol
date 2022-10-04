import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

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
 * Create a HookEmbedderHandler instance, using a reference to an element
 * around the block.
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
    entityId: string;
    path: string;
  };
};

/**
 * Pass a node by ref to the embedding application's hook service.
 *
 * @param service The hook service returned by {@link useHookBlockService}
 * @param ref A React ref containing the DOM node. This hook will ensure the
 *            embedding application is notified when the underlying DOM node
 *            inside the ref changes
 * @param type The type of hook – i.e, "text"
 * @param entityId The entityId of the entity on which to store data associated with the hook
 * @param path The path in the entity's properties to the data associated with the hook
 * @param fallback A fallback to be called if the embedding application doesn't
 *                 implement the hook service, or doesn't implement this
 *                 specific type of hook. Return a function to "teardown" your
 *                 fallback (i.e, remove any event listeners).
 */
export const useHook = <T extends HTMLElement>(
  service: HookBlockHandler | null,
  ref: RefObject<T | null | void>,
  type: string,
  entityId: string,
  path: string,
  fallback: (node: T) => void | (() => void),
) => {
  /**
   * React can't catch async errors to handle them within ErrorBoundary's, etc,
   * but if you throw it inside the callback for a setState function, it can.
   *
   * @see https://github.com/facebook/react/issues/14981#issuecomment-468460187
   */
  const [, catchError] = useState();

  /**
   * The fallback may change in between the hook message being sent, and the
   * not implemented error being received. This allows to ensure we call the
   * latest fallback, with no chance of calling a stale closure
   */
  const fallbackRef = useRef(fallback);
  useLayoutEffect(() => {
    fallbackRef.current = fallback;
  });

  const existingHookRef = useRef<null | Hook<T>>(null);

  /**
   * We can't use the normal effect teardown to trigger the hook teardown, as
   * in order to detect changes to the node underlying the ref, we run our main
   * effect on every render. Therefore, we create a "mount" effect and trigger
   * the teardown in the mount effect teardown.
   */
  useLayoutEffect(() => {
    return () => {
      existingHookRef.current?.teardown?.().catch((err) => {
        catchError(() => {
          throw err;
        });
      });
    };
  }, []);

  useLayoutEffect(() => {
    const existingHook = existingHookRef.current?.params;
    const node = ref.current;

    /**
     * We cannot use the dependency array for the effect, as refs aren't updated
     * during render, so the value passed into the dependency array for the ref
     * won't have updated and therefore updates to the underlying node wouldn't
     * trigger this effect, and embedding applications wouldn't be notified.
     *
     * Instead, we run the effect on every render and do our own change
     * detection.
     */
    if (
      existingHook &&
      existingHook.service === service &&
      existingHook.node === node &&
      existingHook.entityId === entityId &&
      existingHook.path === path &&
      existingHook.type === type
    ) {
      return;
    }

    const teardownPromise =
      existingHookRef.current?.teardown?.().catch() ?? Promise.resolve();

    if (node && service) {
      const controller = new AbortController();

      /**
       * Is this an update to the existing hook, or is it a whole new hook? The
       * only param to the hook which can change without creating a new hook is
       * the node. Any other change will result in a new hook being created
       */
      const reuseId =
        existingHook &&
        existingHook.service === service &&
        existingHook.entityId === entityId &&
        existingHook.path === path &&
        existingHook.type === type;

      const hook: Hook<T> = {
        id: reuseId ? existingHookRef.current?.id ?? null : null,
        params: {
          service,
          type,
          entityId,
          path,
          node,
        },
        async teardown() {
          if (controller.signal.aborted) {
            return;
          }

          controller.abort();

          const hookId = hook.id;

          if (hookId) {
            try {
              hook.id = null;
              if (existingHookRef.current === hook) {
                existingHookRef.current = null;
              }

              if (!service.destroyed) {
                await service.hook({
                  data: {
                    hookId,
                    entityId,
                    path,
                    type,
                    node: null,
                  },
                });
              }
            } catch (err) {
              catchError(() => {
                throw err;
              });
            }
          }
        },
      };

      existingHookRef.current = hook;

      teardownPromise
        .then(() => {
          if (service.destroyed || controller.signal.aborted) {
            return;
          }

          return service
            .hook({
              data: {
                hookId: hook.id,
                entityId,
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
          catchError(() => {
            throw err;
          });
        });
    } else {
      existingHookRef.current = null;
    }
  });
};
