import { memoizeFetchFunction } from "./util";
import { blockDependencies } from "../../../block.dependencies";

export type UnknownComponent =
  | typeof HTMLElement
  | ((...props: any[]) => JSX.Element);

export type FetchSourceFn = (
  url: string,
  signal?: AbortSignal | undefined,
) => Promise<string>;

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

const defaultFetchFn: FetchSourceFn = (url, signal) =>
  fetch(url, { signal: signal ?? null }).then((data) => data.text());

const crossFrameFetchFn = (url: string) =>
  sendMessage<string>({ payload: url, type: "fetchTextFromUrl" });

type FetchAndParseFn = (
  fetchSourceFn: FetchSourceFn,
) => (
  url: string,
  signal?: AbortSignal,
) => Promise<string | Record<string, UnknownComponent>>;

const fetchAndParseBlock: FetchAndParseFn = (fetchSourceFn) => (url, signal) =>
  fetchSourceFn(url, signal).then((source) => {
    if (url.endsWith(".html")) {
      return source;
    }

    /**
     * Load a commonjs module from a url and wrap it/supply with key variables
     * @see https://nodejs.org/api/modules.html#modules_the_module_wrapper
     * @see https://github.com/Paciolan/remote-module-loader/blob/master/src/lib/loadRemoteModule.ts
     */
    const exports = {};
    const module = { exports };
    // eslint-disable-next-line no-new-func,@typescript-eslint/no-implied-eval
    const func = new Function("require", "module", "exports", source);
    func(requires, module, exports);

    /**
     * @todo check it's actually a React component
     * we can use a different rendering strategy for other component types
     * */
    return module.exports as Record<string, UnknownComponent>;
  });

export const loadRemoteBlock = memoizeFetchFunction(
  fetchAndParseBlock(defaultFetchFn),
);

export const loadCrossFrameRemoteBlock = memoizeFetchFunction(
  fetchAndParseBlock(crossFrameFetchFn),
);
