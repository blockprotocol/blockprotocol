import { v4 as uuid } from "uuid";

import { crossFrameRequestMap, UnknownBlock } from "./shared";

type FetchSourceFunction = (
  url: string,
  signal?: AbortSignal | undefined,
) => Promise<string>;

const defaultFetchFunction: FetchSourceFunction = (url, signal) =>
  fetch(url, { signal: signal ?? null }).then((data) => data.text());

const crossFrameFetchFunction = (url: string) => {
  const requestId = uuid();
  const promise = new Promise<string>((resolve, reject) => {
    crossFrameRequestMap.set(requestId, { resolve, reject });

    const timeout = 10_000;
    setTimeout(() => {
      reject(
        new Error(
          `Cross-frame request ${requestId} unresolved in ${
            timeout / 1000
          } seconds.`,
        ),
      );
    }, timeout);
  });

  // eslint-disable-next-line no-restricted-globals
  parent.window.postMessage(
    { payload: url, requestId, type: "fetchTextFromUrl" },
    origin,
  );
  return promise;
};

type FetchAndParseFunction = (
  url: string,
  signal?: AbortSignal | undefined,
  requiresFunction?: Record<string, any>,
) => Promise<string | Record<string, UnknownBlock>>;

type CreateFetchAndParseFunction = (
  fetchSourceFunction: FetchSourceFunction,
) => FetchAndParseFunction;

const createFetchAndParseBlockFunction: CreateFetchAndParseFunction =
  (fetchSourceFunction) => (url, signal, requiresFunction) =>
    fetchSourceFunction(url, signal).then((source) => {
      if (url.endsWith(".html")) {
        return source;
      }

      /**
       * Load a commonjs module from a url and wrap it/supply with key variables
       * @see https://nodejs.org/api/modules.html#modules_the_module_wrapper
       */
      const exports = {};
      const module = { exports };
      // eslint-disable-next-line no-new-func,@typescript-eslint/no-implied-eval
      const func = new Function("require", "module", "exports", source);
      func(requiresFunction, module, exports);

      return module.exports as Record<string, UnknownBlock>;
    });

const memoizeFetchAndParseFunction = (
  fetchFunction: FetchAndParseFunction,
): FetchAndParseFunction => {
  const cache: Record<string, Promise<any>> = {};

  return async (url, signal) => {
    if (cache[url] == null) {
      let fulfilled = false;
      const promise = fetchFunction(url, signal);

      promise
        .then(() => {
          fulfilled = true;
        })
        .catch(() => {
          if (cache[url] === promise) {
            delete cache[url];
          }
        });

      signal?.addEventListener("abort", () => {
        if (cache[url] === promise && !fulfilled) {
          delete cache[url];
        }
      });

      cache[url] = promise;
    }

    return await cache[url];
  };
};

export const loadRemoteBlock = memoizeFetchAndParseFunction(
  createFetchAndParseBlockFunction(defaultFetchFunction),
);

export const loadCrossFrameRemoteBlock = memoizeFetchAndParseFunction(
  createFetchAndParseBlockFunction(crossFrameFetchFunction),
);
