import { BlockProtocolEntity } from "blockprotocol";
import { useMockBlockProps } from "mock-block-dock";
import { VoidFunctionComponent } from "react";
import { BlockLoader } from "react-block-loader";

import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks";
import { BlockSchema } from "./hub-utils";

export type BlockDependency = keyof typeof blockDependencies;

/* eslint-disable global-require */
const blockDependencies = {
  react: require("react"),
  "react-dom": require("react-dom"),
  twind: require("twind"),
  lodash: require("lodash"),
};
/* eslint-enable global-require */

type BlockProps = {
  blockProperties: BlockProtocolEntity;
  blockMetadata: BlockMetadata;
  blockSchema: BlockSchema;
};

export const Block: VoidFunctionComponent<BlockProps> = ({
  blockProperties: partialBlockProperties,
  blockMetadata,
  blockSchema,
}) => {
  const {
    blockProperties,
    blockProtocolFunctions,
    entityTypes,
    linkedAggregations,
    linkedEntities,
    linkGroups,
  } = useMockBlockProps({
    blockProperties: partialBlockProperties,
    blockSchema,
  });

  return (
    <BlockLoader
      blockMetadata={blockMetadata}
      blockProperties={{
        ...blockProperties,
        ...entityTypes,
        ...linkedAggregations,
        ...linkedEntities,
        ...linkGroups,
      }}
      blockProtocolFunctions={blockProtocolFunctions}
      externalDependencies={blockDependencies}
      sourceUrl={blockMetadata.source}
    />
  );
};
