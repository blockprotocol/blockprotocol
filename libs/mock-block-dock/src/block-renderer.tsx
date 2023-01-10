import { HtmlBlockDefinition } from "@blockprotocol/core";
import { ComponentType, FunctionComponent } from "react";

import { CustomElementLoader } from "./block-renderer/custom-element";
import { HtmlLoader } from "./block-renderer/html";

type BlockRendererProps = {
  customElement?: {
    elementClass: typeof HTMLElement;
    tagName: string;
  };
  html?: HtmlBlockDefinition;
  properties: Record<string, unknown>;
  ReactComponent?: ComponentType;
};

export const BlockRenderer: FunctionComponent<BlockRendererProps> = ({
  customElement,
  html,
  properties,
  ReactComponent,
}) => {
  if (ReactComponent) {
    return <ReactComponent {...properties} />;
  } else if (customElement) {
    return <CustomElementLoader properties={properties} {...customElement} />;
  } else if (html) {
    return <HtmlLoader html={html} />;
  }
  throw new Error(
    "One of reactElement, customElement or html must be provided.",
  );
};
