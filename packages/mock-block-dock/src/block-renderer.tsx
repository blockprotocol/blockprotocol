import React, { ComponentType, VoidFunctionComponent } from "react";

import { CustomElementLoader } from "./block-renderer/custom-element";

type BlockRendererProps = {
  customElement?: {
    elementClass: typeof HTMLElement;
    tagName: string;
  };
  htmlString?: string;
  properties: Record<string, unknown>;
  ReactComponent?: ComponentType;
};

export const BlockRenderer: VoidFunctionComponent<BlockRendererProps> = ({
  customElement,
  htmlString,
  properties,
  ReactComponent,
}) => {
  if (ReactComponent) {
    return <ReactComponent {...properties} />;
  } else if (customElement) {
    return <CustomElementLoader properties={properties} {...customElement} />;
  } else if (htmlString) {
    // @todo implement HTML block renderer
  }
  throw new Error(
    "One of reactElement, customElement or htmlString must be provided.",
  );
};
