import { useServiceConstructor } from "@blockprotocol/core/react";
import { RefObject } from "react";

import {
  ExternalApiBlockHandler,
  ExternalApiEmbedderHandler,
} from "./index.js";

/**
 * Create a ExternalApiBlockHandler instance, using a reference to an element in the block.
 *
 * The externalApiService will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by calling externalApiService.on("messageName", callback);
 */
export const useExternalApiBlockService = (
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof ExternalApiBlockHandler>[0],
    "element"
  >,
): { externalApiService: ExternalApiBlockHandler } => ({
  externalApiService: useServiceConstructor({
    Handler: ExternalApiBlockHandler,
    constructorArgs,
    ref,
  }),
});

/**
 * Create a ExternalApiBlockHandler instance, using a reference to an element in the block.
 *
 * The externalApiService will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by:
 * 1. to register one, call externalApiService.on("messageName", callback);
 * 2. to register multiple, call externalApiService.registerCallbacks({ [messageName]: callback });
 */
export const useExternalApiEmbedderService = (
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof ExternalApiEmbedderHandler>[0],
    "element"
  >,
): { externalApiService: ExternalApiEmbedderHandler } => ({
  externalApiService: useServiceConstructor({
    Handler: ExternalApiEmbedderHandler,
    ref,
    constructorArgs,
  }),
});
