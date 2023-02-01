import { useServiceConstructor } from "@blockprotocol/core/dist/esm/react.js";
import { RefObject, VoidFunctionComponent } from "react";

import {
  BlockGraphProperties,
  GraphBlockHandler,
  GraphEmbedderHandler,
} from "./index.js";

export type BlockComponent<
  Properties extends Record<string, unknown> | null = null,
> = VoidFunctionComponent<BlockGraphProperties<Properties>>;

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
): { graphService: GraphBlockHandler } => ({
  graphService: useServiceConstructor({
    Handler: GraphBlockHandler,
    constructorArgs,
    ref,
  }),
});

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
): { graphService: GraphEmbedderHandler } => ({
  graphService: useServiceConstructor({
    Handler: GraphEmbedderHandler,
    ref,
    constructorArgs,
  }),
});
