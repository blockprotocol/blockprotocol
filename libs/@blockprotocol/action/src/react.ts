import { useModuleConstructor } from "@blockprotocol/core/react";
import { RefObject } from "react";

import { ActionBlockHandler, ActionEmbedderHandler } from "./index.js";

/**
 * Create a ActionBlockHandler instance, using a reference to an element in the block.
 */
export const useActionBlockModule = (
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof ActionBlockHandler>[0],
    "element"
  >,
): { actionModule: ActionBlockHandler } => ({
  actionModule: useModuleConstructor({
    Handler: ActionBlockHandler,
    constructorArgs,
    ref,
  }),
});

/**
 * Create a ActionBlockHandler instance, using a reference to an element in the block.
 */
export const useActionEmbedderModule = (
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof ActionEmbedderHandler>[0],
    "element"
  >,
): { actionModule: ActionEmbedderHandler } => ({
  actionModule: useModuleConstructor({
    Handler: ActionEmbedderHandler,
    ref,
    constructorArgs,
  }),
});
