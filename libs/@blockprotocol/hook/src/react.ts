import { useModuleConstructor } from "@blockprotocol/core/react";
import { EntityId } from "@blockprotocol/graph";
import { RefObject, useLayoutEffect, useRef, useState } from "react";

import { HookBlockHandler, HookEmbedderHandler } from "./index.js";
/**
 * Create a HookBlockHandler instance, using a reference to an element in the
 * block.
 *
 * The hookModule will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by
 * calling hookModule.on("messageName", callback);
 */
export const useHookBlockModule = (
  ref: RefObject<HTMLElement | null>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof HookBlockHandler>[0],
    "element"
  >,
): { hookModule: HookBlockHandler } => ({
  hookModule: useModuleConstructor({
    Handler: HookBlockHandler,
    constructorArgs,
    ref,
  }),
});

/**
 * Create a HookEmbedderHandler instance, using a reference to an element
 * around the block.
 *
 * The hookModule will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by
 * calling hookModule.on("messageName", callback);
 */
export const useHookEmbedderModule = (
  ref: RefObject<HTMLElement | null>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof HookEmbedderHandler>[0],
    "element"
  >,
): { hookModule: HookEmbedderHandler } => ({
  hookModule: useModuleConstructor({
    Handler: HookEmbedderHandler,
    ref,
    constructorArgs,
  }),
});

type Hook<T extends HTMLElement> = {
  id: string | null;
  cancel: () => void;
  teardown: (() => Promise<void>) | null;
  params: {
    module: HookBlockHandler | null;
    node: T;
    type: string;
    entityId: EntityId;
    path: (string | number)[];
  };
};

/**
 * Pass a node by ref to the embedding application's hook module.
 *
 * @param module The hook module returned by {@link useHookBlockModule}
 * @param ref A React ref containing the DOM node. This hook will ensure the
 *            embedding application is notified when the underlying DOM node
 *            inside the ref changes
 * @param type The type of hook – i.e, "text"
 * @param entityId The entityId of the entity on which to store data associated with the hook
 * @param path The path in the entity's properties to the data associated with the hook
 * @param fallback A fallback to be called if the embedding application doesn't
 *                 implement the hook module, or doesn't implement this
 *                 specific type of hook. Return a function to "teardown" your
 *                 fallback (i.e, remove any event listeners).
 */
export const useHook = <T extends HTMLElement>(
  module: HookBlockHandler,
  ref: RefObject<T | null | void>,
  type: string,
  entityId: EntityId,
  path: (string | number)[],
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
      existingHook.module === module &&
      existingHook.node === node &&
      existingHook.entityId === entityId &&
      JSON.stringify(existingHook.path) === JSON.stringify(path) &&
      existingHook.type === type
    ) {
      return;
    }

    const existingHookId = existingHookRef.current?.id;

    existingHookRef.current?.cancel();

    if (node) {
      const controller = new AbortController();

      const hook: Hook<T> = {
        id: existingHookId ?? null,
        params: {
          module,
          type,
          entityId,
          path,
          node,
        },
        cancel() {
          controller.abort();
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

              if (!module.destroyed) {
                await module.hook({
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

      module
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
              const firstError = response.errors[0];
              if (firstError?.code === "NOT_IMPLEMENTED") {
                const teardown = fallbackRef.current(node);

                hook.teardown = async () => {
                  controller.abort();
                  teardown?.();
                };
              } else if (firstError?.code === "NOT_FOUND") {
                const errMsg = `Hook with id ${hook.id} was not found by embedding application`;
                if (node === null) {
                  // don't throw if the request was for hook deletion – the embedding app can't find the hook, things can continue
                  // eslint-disable-next-line no-console -- useful for debugging
                  console.warn(`${errMsg} – no hook to remove`);
                } else {
                  throw new Error(errMsg);
                }
              } else {
                // eslint-disable-next-line no-console
                console.error(response.errors);
                throw new Error("Unknown error in hook");
              }
            } else if (response.data) {
              hook.id = response.data.hookId;
            }
          }
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
