import {
  BlockMetadata,
  BlockProtocolFunctions,
  BlockProtocolProps,
} from "blockprotocol";
import React, { ReactElement, VoidFunctionComponent } from "react";

import { HtmlBlock } from "./html-block";
import { BlockNameWithNamespace, UnknownBlock } from "./shared";
import { useRemoteBlock } from "./use-remote-block";

const WebComponentBlock = React.lazy(() => import("./web-component-block"));

export type BlockLoaderProps = {
  blockMetadata?: BlockMetadata;
  blockProperties: Omit<BlockProtocolProps, keyof BlockProtocolFunctions>;
  blockProtocolFunctions: BlockProtocolFunctions;
  crossFrame?: boolean;
  externalDependencies?: Record<string, any>;
  LoadingIndicator?: ReactElement;
  onBlockLoaded?: () => void;
  sourceUrl: string;
};

const isHtmlElement = (
  component: UnknownBlock,
): component is typeof HTMLElement =>
  typeof component !== "string" && component.prototype instanceof HTMLElement;

/**
 * Fetches, parses, and renders a component or HTML file from a provided URL.
 * Passes on any supplied properties and functions as specified in the Block Protocol.
 * For Web Components, will listen to emitted events which match BP function names.
 * @see https://blockprotocol.org
 *
 * @param {object} [blockMetadata] the block's block-metadata.json. Used to determine Web Component tag names.
 * @param {object} blockProperties the block's own properties, and BP-specified properties (e.g. entityId, linkGroups)
 * @param {object} blockProtocolFunctions the functions listed in the Block Protocol spec
 * @param {boolean} [crossFrame = false] whether this block should make requests to the parent window for block source
 * @param {object} [externalDependencies] any dependencies the block lists as 'externals' that it expects to be provided
 * @param {ReactElement} [LoadingIndicator] an element to display while the block is loading
 * @param {function} [onBlockLoaded] a callback, called when the block has been successfully parsed and loaded
 * @param {string} sourceUrl the URL to the entry source file for the block
 */
export const BlockLoader: VoidFunctionComponent<BlockLoaderProps> = ({
  blockMetadata,
  blockProperties,
  blockProtocolFunctions,
  crossFrame = false,
  externalDependencies,
  LoadingIndicator,
  onBlockLoaded,
  sourceUrl,
}) => {
  const [loading, err, Component] = useRemoteBlock(
    sourceUrl,
    crossFrame,
    onBlockLoaded,
    externalDependencies,
  );

  if (loading) {
    return LoadingIndicator ?? <div>Loading...</div>;
  }

  if (err) {
    throw err;
  }

  if (!Component) {
    throw new Error("Could not load and parse block from URL");
  }

  if (typeof Component === "string") {
    return <HtmlBlock html={Component} {...blockProperties} />;
  }

  if (isHtmlElement(Component)) {
    return (
      <WebComponentBlock
        name={{
          // @todo figure out if we should enforce 'namespace/name' block name format, and update bp type
          blockName:
            (blockMetadata?.name as BlockNameWithNamespace | undefined) ??
            "@unknown/fallback-element-name",
          // @todo add custom element tag name to block metadata and use when defined
        }}
        elementClass={Component}
        functions={blockProtocolFunctions}
        {...blockProperties}
      />
    );
  }

  return <Component {...blockProperties} {...blockProtocolFunctions} />;
};
