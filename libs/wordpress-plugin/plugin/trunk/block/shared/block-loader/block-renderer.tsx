import { BlockGraphProperties } from "@blockprotocol/graph";
import { ReactElement } from "react";

import { CustomElementLoader } from "./block-renderer/custom-element";
import { HtmlLoader } from "./block-renderer/html";
import { UnknownBlock } from "./load-remote-block";

type BlockRendererProps = {
  blockName: string;
  blockSource: UnknownBlock;
  properties: BlockGraphProperties;
  sourceUrl: string;
};

export const BlockRenderer = ({
  blockName,
  blockSource,
  properties,
  sourceUrl,
}: BlockRendererProps) => {
  if (typeof blockSource === "string") {
    return <HtmlLoader html={{ source: blockSource, url: sourceUrl }} />;
  }
  if (blockSource.prototype instanceof HTMLElement) {
    return (
      <CustomElementLoader
        elementClass={blockSource as typeof HTMLElement}
        properties={properties}
        tagName={blockName}
      />
    );
  }

  const BlockComponent = blockSource as (...props: any[]) => ReactElement;
  return <BlockComponent {...properties} />;
};
