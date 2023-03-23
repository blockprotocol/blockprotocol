import { ReactElement } from "react";

import { memoizeFetchFunction } from "../util";
import { getContainingIframe } from "./get-containing-iframe";

export type UnknownBlock =
  | string
  | typeof HTMLElement
  | ((...props: any[]) => ReactElement);

export type FetchSourceFn = (
  url: string,
  signal?: AbortSignal | undefined,
) => Promise<string>;

/**
 * Dependencies to be made available to external blocks must be referenced here
 */
const blockDependencies: Record<string, any> = {
  // eslint-disable-next-line global-require -- intentionally providing commonjs require for blocks
  react: require("react"),
  // eslint-disable-next-line global-require -- intentionally providing commonjs require for blocks
  "react-dom": require("react-dom"),
};

/**
 * Adapted from https://github.com/Paciolan/remote-module-loader
 */

const requires = (name: string) => {
  if (!(name in blockDependencies)) {
    throw new Error(
      `Could not require '${name}'. '${name}' does not exist in dependencies.`,
    );
  }

  return blockDependencies[name];
};

const fetchFn: FetchSourceFn = (url, signal) =>
  fetch(url, { signal: signal ?? null }).then((data) => data.text());

type FetchAndParseFn = (
  fetchSourceFn: FetchSourceFn,
) => (url: string, signal?: AbortSignal) => Promise<UnknownBlock>;

export const parseBlockSource = (
  source: string,
  sourceUrl: string,
): UnknownBlock => {
  if (sourceUrl.endsWith(".html")) {
    return source;
  }

  /**
   * Load a commonjs module from a url and wrap it/supply with key variables
   *
   * @see https://nodejs.org/api/modules.html#modules_the_module_wrapper
   * @see https://github.com/Paciolan/remote-module-loader/blob/master/src/lib/loadRemoteModule.ts
   */
  const exports: Record<string, UnknownBlock> = {};
  const module = { exports };

  /**
   * If the block has been portalled into an iFrame, we need to overwrite its document, because:
   * - within a block, 'document' will refer to the _parent_ document, not the document of the iFrame it is rendered in
   * - styling libraries which work by appending styles to document.head are going to add styles to the parent document
   *   - e.g. webpack style-loader (for imported CSS files), or emotion
   * - styles are therefore not present in the iFrame
   *
   * We therefore check if the Gutenberg iFrame is present, and if so overwrite the value of 'document' to the iFrame's document.
   * Styles still fail to load on some blocks, e.g. TLDraw's styles in the 'drawing' block
   * @todo investigate how TLDraw's styles are loaded and make them load
   */
  const iframe = getContainingIframe();
  const documentBlockRenderedInside = iframe?.contentDocument ?? document;

  // eslint-disable-next-line no-new-func
  const func = new Function("require", "module", "exports", "document", source);

  func(requires, module, exports, documentBlockRenderedInside);

  const exported =
    module.exports.default ??
    module.exports.App ??
    module.exports[Object.keys(module.exports)[0] ?? ""];

  if (!exported) {
    throw new Error(
      "Block component must be exported as one of 'default', 'App', or the single named export",
    );
  }

  return exported;
};

const fetchAndParseBlock: FetchAndParseFn = (fetchSourceFn) => (url, signal) =>
  fetchSourceFn(url, signal).then((source) => parseBlockSource(source, url));

export const loadRemoteBlock = memoizeFetchFunction(
  fetchAndParseBlock(fetchFn),
);
