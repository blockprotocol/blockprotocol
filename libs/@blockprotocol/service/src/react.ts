import { useModuleConstructor } from "@blockprotocol/core/react";
import { RefObject } from "react";

import { ServiceBlockHandler, ServiceEmbedderHandler } from "./index.js";

/**
 * Create a ServiceBlockHandler instance, using a reference to an element in the block.
 *
 * The serviceModule will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by calling serviceModule.on("messageName", callback);
 */
export const useServiceBlockModule = (
  ref: RefObject<HTMLElement | null>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof ServiceBlockHandler>[0],
    "element"
  >,
): { serviceModule: ServiceBlockHandler } => ({
  serviceModule: useModuleConstructor({
    Handler: ServiceBlockHandler,
    constructorArgs,
    ref,
  }),
});

/**
 * Create a ServiceBlockHandler instance, using a reference to an element in the block.
 *
 * The serviceModule will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by:
 * 1. to register one, call serviceModule.on("messageName", callback);
 * 2. to register multiple, call serviceModule.registerCallbacks({ [messageName]: callback });
 */
export const useServiceEmbedderModule = (
  ref: RefObject<HTMLElement | null>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof ServiceEmbedderHandler>[0],
    "element"
  >,
): { serviceModule: ServiceEmbedderHandler } => ({
  serviceModule: useModuleConstructor({
    Handler: ServiceEmbedderHandler,
    ref,
    constructorArgs,
  }),
});
