import {
  BlockMetadata,
  BlockProtocolFunctions,
  BlockProtocolProps,
} from "blockprotocol";
import { MockBlockDock } from "mock-block-dock";
import React, { useEffect, useState, VoidFunctionComponent } from "react";
import * as ReactDOM from "react-dom";

import { BlockLoader, BlockLoaderProps } from "../src/block-loader";

const node = document.getElementById("app");

// @todo put this in blockprotocol package
const blockProtocolFunctionNames = [
  "aggregateEntities",
  "createEntities",
  "getEntities",
  "deleteEntities",
  "updateEntities",

  "aggregateEntityTypes",
  "createEntityTypes",
  "getEntityTypes",
  "updateEntityTypes",
  "deleteEntityTypes",

  "getLinks",
  "createLinks",
  "deleteLinks",
  "updateLinks",

  "uploadFile",
];

const blockDependencies: Record<string, any> = {
  /* eslint-disable global-require */
  lodash: require("lodash"),
  react: require("react"),
  "react-dom": require("react-dom"),
  twind: require("twind"),
  /* eslint-enable global-require */
};

const MockBlockToRemoteBlock: VoidFunctionComponent<
  BlockProtocolProps & { componentId: string }
> = ({ componentId, ...props }) => {
  const [blockMetadata, setBlockMetadata] = useState<BlockMetadata | null>(
    null,
  );

  useEffect(() => {
    fetch(`${componentId}/block-metadata.json`)
      .then((resp) => resp.json())
      .then(setBlockMetadata);
  }, [componentId]);

  if (!blockMetadata) {
    return <div>Loading block metadata...</div>;
  }

  const { blockProperties, blockProtocolFunctions } = Object.entries(
    props,
  ).reduce<{
    blockProperties: BlockLoaderProps["blockProperties"];
    blockProtocolFunctions: BlockLoaderProps["blockProtocolFunctions"];
  }>(
    (objectSoFar, [key, value]) => {
      if (key in blockProtocolFunctionNames) {
        // eslint-disable-next-line no-param-reassign
        objectSoFar.blockProtocolFunctions[
          key as keyof BlockProtocolFunctions
        ] = value;
      } else {
        // eslint-disable-next-line no-param-reassign
        objectSoFar.blockProperties[
          key as keyof Omit<BlockProtocolProps, keyof BlockProtocolFunctions>
        ] = value;
      }
      return objectSoFar;
    },
    {
      blockProperties: { entityId: "will-be-overwritten" },
      blockProtocolFunctions: {},
    },
  );

  const absoluteUrlRegExp = /^(?:[a-z]+:)?\/\//i;

  const absoluteSourceUrl = absoluteUrlRegExp.test(blockMetadata.source)
    ? blockMetadata.source
    : `${componentId}/${blockMetadata.source}`;

  return (
    <BlockLoader
      blockMetadata={blockMetadata}
      blockProperties={blockProperties}
      blockProtocolFunctions={blockProtocolFunctions}
      externalDependencies={blockDependencies}
      LoadingIndicator={<h1>Custom loading indicator</h1>}
      onBlockLoaded={() =>
        // eslint-disable-next-line no-console
        console.log(`Block with componentId ${componentId} loaded.`)
      }
      sourceUrl={absoluteSourceUrl}
    />
  );
};

const DevApp = () => {
  return (
    <MockBlockDock>
      <MockBlockToRemoteBlock
        entityId="test-entity-id"
        componentId="https://blockprotocol.org/blocks/@hash/table"
      />
    </MockBlockDock>
  );
};

ReactDOM.render(<DevApp />, node);
