import {
  BlockMetadata,
  BlockProtocolFunctions,
  BlockProtocolProps,
} from "blockprotocol";
import { ReactElement, VoidFunctionComponent } from "react";

import { HtmlBlock } from "./HtmlBlock";
import { useRemoteBlock } from "./useRemoteBlock";
import { WebComponentBlock } from "./WebComponentBlock";
import { BlockNameWithNamespace, UnknownBlock } from "./shared";

type RemoteBlockProps = {
  blockMetadata: BlockMetadata;
  blockProperties: Omit<BlockProtocolProps, keyof BlockProtocolFunctions>;
  blockProtocolFunctions: BlockProtocolFunctions;
  crossFrame?: boolean;
  externalDependencies?: Record<string, any>;
  LoadingIndicator?: ReactElement;
  sourceUrl: string;
  onBlockLoaded?: () => void;
};

export const FallbackLoadingIndicator: VoidFunctionComponent = () => (
  <div>Loading...</div>
);

const isHtmlElement = (
  component: UnknownBlock,
): component is typeof HTMLElement =>
  typeof component !== "string" && component.prototype instanceof HTMLElement;

/**
 * Fetches, parses, and renders a component or HTML file from a provided URL.
 * Passes on any supplied properties and functions as specified in the Block Protocol.
 * For Web Components, will listen to emitted events which match BP function names.
 *
 * @param {Object} [blockMetadata] the block's block-metadata.json. Used to determine Web Component tag names.
 * @param {Object} blockProperties the block's own properties, and BP-specified properties (e.g. entityId, linkGroups)
 * @param {boolean} [crossFrame = false] whether this block should make requests to the parent window for block source
 * @param {Object} blockProtocolFunctions
 * @param {Object} [externalDependencies]
 * @param LoadingIndicator
 * @param sourceUrl
 * @param onBlockLoaded
 * @constructor
 */
export const RemoteBlock: VoidFunctionComponent<RemoteBlockProps> = ({
  blockMetadata,
  blockProperties,
  crossFrame = false,
  blockProtocolFunctions,
  externalDependencies,
  LoadingIndicator,
  sourceUrl,
  onBlockLoaded,
}) => {
  const [loading, err, Component] = useRemoteBlock(
    sourceUrl,
    crossFrame,
    onBlockLoaded,
    externalDependencies,
  );

  if (loading) {
    return LoadingIndicator ?? <FallbackLoadingIndicator />;
  }

  if (err) {
    throw err;
  }

  if (!Component) {
    throw new Error("Could not load and parse block from URL");
  }

  if (typeof Component === "string") {
    return <HtmlBlock html={Component} />;
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
