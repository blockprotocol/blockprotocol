import { useModuleConstructor } from "@blockprotocol/core/react";
import { FunctionComponent, RefObject, useMemo } from "react";

import {
  BlockGraphProperties,
  Entity,
  EntityVertexId,
  GraphBlockHandler,
  GraphEmbedderHandler,
  LinkEntityAndRightEntity,
  Subgraph,
} from "./main.js";
import { getOutgoingLinkAndTargetEntities, getRoots } from "./stdlib.js";

type ColorOptions = {
  light: string;
  main: string;
  dark: string;
};

type TypographyOptions = {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  textDecoration?: string;
  textTransform?: string;
};

export type BlockProtocolThemeObject = {
  colors: {
    // from https://mui.com/material-ui/customization/palette/
    primary: ColorOptions;
    secondary: ColorOptions;
    error: ColorOptions;
    warning: ColorOptions;
    info: ColorOptions;
    success: ColorOptions;

    // from https://primer.style/design/foundations/color
    background: {
      main: string;
      inset: string;
      subtle: string;
      emphasis: string;
    };
    foreground: {
      main: string;
      muted: string;
      subtle: string;
      onEmphasis: string;
    };
    border: {
      main: string;
      muted: string;
    };
  };
  typography: TypographyOptions & {
    h1: TypographyOptions;
    h2: TypographyOptions;
    h3: TypographyOptions;
    h4: TypographyOptions;
    h5: TypographyOptions;
    h6: TypographyOptions;
  };
};

export type BlockComponent<RootEntity extends Entity = Entity> =
  FunctionComponent<
    BlockGraphProperties<RootEntity> & { theme: BlockProtocolThemeObject }
  >;

/**
 * Create a GraphBlockHandler instance, using a reference to an element in the block.
 *
 * The graphModule will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by calling graphModule.on("messageName", callback);
 */
export const useGraphBlockModule = (
  ref: RefObject<HTMLElement>,
  constructorArgs?: Omit<
    ConstructorParameters<typeof GraphBlockHandler>[0],
    "element"
  >,
): { graphModule: GraphBlockHandler } => ({
  graphModule: useModuleConstructor({
    Handler: GraphBlockHandler,
    constructorArgs,
    ref,
  }),
});

/**
 * Create a GraphBlockHandler instance, using a reference to an element in the block.
 *
 * The graphModule will only be reconstructed if the element reference changes.
 * Updates to any callbacks after first constructing should be made by:
 * 1. to register one, call graphModule.on("messageName", callback);
 * 2. to register multiple, call graphModule.registerCallbacks({ [messageName]: callback });
 */
export const useGraphEmbedderModule = (
  ref: RefObject<HTMLElement>,
  constructorArgs: Omit<
    ConstructorParameters<typeof GraphEmbedderHandler>[0],
    "element"
  >,
): { graphModule: GraphEmbedderHandler } => ({
  graphModule: useModuleConstructor({
    Handler: GraphEmbedderHandler as { new (): GraphEmbedderHandler },
    ref,
    constructorArgs,
  }),
});

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
