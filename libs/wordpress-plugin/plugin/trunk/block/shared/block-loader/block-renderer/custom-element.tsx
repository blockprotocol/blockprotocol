import { createComponent } from "@lit-labs/react";
// eslint-disable-next-line unicorn/import-style -- needed to pass to createComponent
import React, { FunctionComponent, useMemo } from "react";

type CustomElementLoaderProps = {
  elementClass: typeof HTMLElement;
  properties: Record<string, unknown>;
  tagName: string;
};

/**
 * Registers (if not already registered) and loads a custom element.
 *
 * @todo share this between wordpress-plugin and mock-block-dock (currently duplicated)
 */
export const CustomElementLoader: FunctionComponent<
  CustomElementLoaderProps
> = ({ elementClass, properties, tagName: originalTagName }) => {
  /**
   * Register the element with the CustomElementsRegistry, if not already registered.
   */
  let tagName = originalTagName;
  let existingCustomElement = customElements.get(tagName);
  let i = 1;

  /**
   * If an element with a different constructor is already registered with this tag,
   * rename until we find a free tag or the tag this element is already registered with.
   * This may break elements that rely on being defined with a specific tag.
   */
  while (existingCustomElement && existingCustomElement !== elementClass) {
    tagName = `${tagName}${i}`;
    existingCustomElement = customElements.get(tagName);
    i++;
  }

  if (!existingCustomElement) {
    try {
      customElements.define(tagName, elementClass);
    } catch (err) {
      // eslint-disable-next-line no-console -- TODO: consider using logger
      console.error(`Error defining custom element: ${(err as Error).message}`);
      throw err;
    }
  }

  const CustomElement = useMemo(
    () => createComponent({ react: React, tagName, elementClass }),
    [elementClass, tagName],
  );

  return <CustomElement {...properties} />;
};
