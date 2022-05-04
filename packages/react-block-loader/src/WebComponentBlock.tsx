import { createComponent, EventName } from "@lit-labs/react";
import { BlockProtocolFunctions, BlockProtocolProps } from "blockprotocol";
import React, { useCallback, VFC } from "react";

import { BlockNameWithNamespace } from "./shared";

/**
 * Custom elements must not use be registered with these names.
 * @see https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
 */
const bannedCustomElementNames = [
  "annotation-xml",
  "color-profile",
  "font-face",
  "font-face-src",
  "font-face-uri",
  "font-face-format",
  "font-face-name",
  "missing-glyph",
];

/**
 * Generates a valid custom element name from a block name.
 * @see https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
 * @param blockName a block name including namespace, e.g. '@hash/my-block'
 */
const generateCustomElementName = (blockName: BlockNameWithNamespace) => {
  if (!blockName.includes("/")) {
    throw new Error(
      "You must pass a block name including namespace, separated by a forward slash, e.g. '@hash/my-block'",
    );
  }
  const customElementName = blockName
    .replace(/\//g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();
  if (bannedCustomElementNames.includes(customElementName)) {
    return `${customElementName}-block`;
  }
  return customElementName;
};

/**
 * The Block Protocol functions in event form
 * @see https://blockprotocol.org/spec/block-types#entity-functions
 */
type BpEventData<
  Operation extends keyof BlockProtocolFunctions = keyof BlockProtocolFunctions,
> = {
  /**
   * The name of the Block Protocol function
   */
  type: Operation;
  /**
   * The argument to pass to the function.
   */
  data: Parameters<Required<BlockProtocolFunctions>[Operation]>[0];
};

/**
 * Determines the name that will be used to register the custom element.
 */
type TagOrBlockName =
  | {
      /**
       * If the tagName is not known, or doesn't matter,
       * it will be derived from the block's name.
       */
      blockName: BlockNameWithNamespace;
    }
  | {
      /**
       * If the element tag name is known, use it.
       * Some custom elements will internally rely on a specific name.
       */
      elementTagName: string;
    };

type WebComponentBlockProps = {
  elementClass: typeof HTMLElement;
  functions: BlockProtocolFunctions;
  name: TagOrBlockName;
} & Omit<BlockProtocolProps, keyof BlockProtocolFunctions>;

/**
 * Registers (if not already registered) and loads a custom element.
 * Listens for events matching Block Protocol functions and calls the relevant function.
 */
export const WebComponentBlock: VFC<WebComponentBlockProps> = ({
  elementClass,
  functions,
  name,
  ...props
}) => {
  /**
   * When a 'blockProtocolEvent' is emitted,
   * call the relevant function passed in props.functions,
   */
  const handleBpEvent = useCallback(
    ({ detail }: CustomEvent<BpEventData>) => {
      const { type, data } = detail;
      const fn = functions[detail.type];
      if (!fn) {
        throw new Error(
          `${type} operation not implemented by embedding application.`,
        );
      }
      fn(data as any) // @todo fix this cast: the compiler doesn't know that the args type will match the fn
        .then((resp) => `Successful call to ${type}: ${resp}`)
        .catch((err) => `Call to ${type} errored: ${err.message}`);
    },
    [functions],
  );

  const tagName =
    "elementTagName" in name
      ? name.elementTagName
      : generateCustomElementName(name.blockName);

  /**
   * Register the element with the CustomElementsRegistry, if not already registered.
   */
  let existingCustomElement = customElements.get(tagName);
  if (!existingCustomElement) {
    try {
      customElements.define(tagName, elementClass);
    } catch (err) {
      // @todo this error is hit even when should not have been already defined - find out why
      // eslint-disable-next-line no-console -- TODO: consider using logger
      console.warn(`Error defining custom element: ${(err as Error).message}`);
    }
  } else if (existingCustomElement !== elementClass) {
    /**
     * If an element with a different constructor is already registered with this name,
     * give this element a different name.
     * This may break elements that rely on being defined with a specific name.
     */
    let i = 0;
    do {
      existingCustomElement = customElements.get(tagName);
      i++;
    } while (existingCustomElement);
    try {
      customElements.define(`${tagName}${i}`, elementClass);
    } catch (err) {
      // eslint-disable-next-line no-console -- TODO: consider using logger
      console.warn(`Error defining custom element: ${(err as Error).message}`);
    }
  }

  // @todo fix type mismatch with React.lazy
  const CustomElement = createComponent(React as any, tagName, elementClass, {
    onBlockProtocolEvent: "blockProtocolEvent" as EventName<
      CustomEvent<BpEventData>
    >,
  });

  return <CustomElement onBlockProtocolEvent={handleBpEvent} {...props} />;
};
