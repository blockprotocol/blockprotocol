import { ReactElement } from "react";

import { memoizeFetchFunction } from "../util";

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
  // eslint-disable-next-line no-new-func
  const func = new Function("require", "module", "exports", source);
  func(requires, module, exports);

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
