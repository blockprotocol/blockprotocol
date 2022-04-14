import {
  BlockMetadata,
  BlockProtocolFunctions,
  BlockProtocolProps,
} from "blockprotocol";
import React from "react";

import { HtmlBlock } from "./HtmlBlock";
import { useRemoteBlock } from "./useRemoteBlock";
import { WebComponentBlock } from "./WebComponentBlock";
import { UnknownComponent } from "./loadRemoteBlock";

type RemoteBlockProps = {
  blockMetadata: BlockMetadata;
  blockProperties: Omit<BlockProtocolProps, keyof BlockProtocolFunctions>;
  crossFrame?: boolean;
  blockProtocolFunctions: BlockProtocolFunctions;
  sourceUrl: string;
  onBlockLoaded?: () => void;
};

export const BlockLoadingIndicator: React.VFC = () => <div>Loading...</div>;

const isHtmlElement = (
  component: UnknownComponent,
): component is typeof HTMLElement =>
  component.prototype instanceof HTMLElement;

/**
 * @see https://github.com/Paciolan/remote-component/blob/2b2cfbb5b6006117c56f3aa7daa2292d3823bb83/src/createRemoteComponent.tsx
 */
export const RemoteBlock: React.VFC<RemoteBlockProps> = ({
  blockMetadata,
  blockProperties,
  crossFrame,
  blockProtocolFunctions,
  sourceUrl,
  onBlockLoaded,
}) => {
  const [loading, err, Component] = useRemoteBlock(
    sourceUrl,
    crossFrame,
    onBlockLoaded,
  );

  if (loading) {
    return <BlockLoadingIndicator />;
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
          blockName: blockMetadata.name as any,
          // @todo add custom element tag name to metadata and use when defined
        }}
        elementClass={Component}
        functions={blockProtocolFunctions}
        {...blockProperties}
      />
    );
  }

  return <Component {...blockProperties} {...blockProtocolFunctions} />;
};
