import { createComponent } from "@lit-labs/react";
// eslint-disable-next-line unicorn/import-style -- needed to pass to createComponent
import React, { FunctionComponent, useMemo } from "react";

import { getContainingIframe } from "../get-containing-iframe";

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
    tagName = `${originalTagName}${i}`;
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

  const iframeContainingBlock = getContainingIframe();
  if (iframeContainingBlock) {
    /**
     * If the block editor is iFramed, blocks are portalled into the iFrame – see docs on {@link getContainingIframe}
     * Code is evaluated in one window and rendered into another, leading to some mismatches between globals
     * One such mismatch is on the custom elements registry – 'customElements' below will refer to the top window registry,
     * but the element needs to be available in the iFrame's own custom element registry (iframeContainingBlock.contentWindow.customElements)
     *
     * Current difficulties:
     * 1. If the element is registered only in the top window's registry, the tag appears in the iFrame's DOM but with no content
     * 2. If the element is registered only in the iFrame's registry, there is an "Illegal constructor" error (i.e. the element is not registered where it needs to be)
     * 3. If the element is registered in both registries, this error: "Failed to construct 'CustomElement': The result must be in the same document"
     *   -- this error possibly related to https://github.com/WICG/webcomponents/issues/907
     *
     * @todo see if there's a way to have the custom element registered and loaded in the iFrame without issue
     *   this may partly involve overwriting 'customElements' in load-remote-block in the same way we do for 'document'
     */
    return (
      <p style={{ border: "1px solid red", padding: 20 }}>
        This block cannot be loaded in the editor, probably due to
        incompatibilities with the Gutenberg plugin. It should still display
        correctly in the final page.
      </p>
    );
  }

  return <CustomElement {...properties} />;
};
