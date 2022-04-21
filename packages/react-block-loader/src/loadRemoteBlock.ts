import { v4 as uuid } from "uuid";

import {
  crossFrameRequestMap,
  isTextFromUrlResponseMessage,
  TextFromUrlRequestMessage,
  UnknownBlock,
} from "./shared";

type FetchSourceFunction = (
  url: string,
  signal?: AbortSignal | undefined,
) => Promise<string>;

/**
 * A simple function to fetch data from a URL and return it as text.
 */
const defaultTextFetchFunction: FetchSourceFunction = (url, signal) =>
  fetch(url, { signal: signal ?? null }).then((data) => data.text());

/**
 * A function that sends a request to the parent window for text from a URL,
 * and leaves a promise to be settled by {@link crossFrameTextFetchResponseHandler}
 */
const crossFrameTextFetchRequestFunction = (url: string) => {
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

  const message: TextFromUrlRequestMessage = {
    payload: { url },
    requestId,
    type: "requestTextFromUrl",
  };

  // eslint-disable-next-line no-restricted-globals
  parent.window.postMessage(message, origin);
  return promise;
};

/**
 * Listens for a response to messages sent by {@link crossFrameTextFetchRequestFunction},
 * and settles the waiting promises wih the response payload.
 */
export const crossFrameTextFetchResponseHandler = (
  message: MessageEvent<unknown>,
) => {
  if (isTextFromUrlResponseMessage(message)) {
    const { payload, requestId } = message.data;
    const promiseSettlerFns = crossFrameRequestMap.get(requestId);
    if (!promiseSettlerFns) {
      throw new Error(
        `Received response to requestId '${requestId}', but request is not in request map.`,
      );
    }
    if (payload.data != null) {
      promiseSettlerFns.resolve(payload.data);
    } else {
      promiseSettlerFns.reject(
        new Error(payload.error || "Request could not be fulfilled."),
      );
    }
    crossFrameRequestMap.delete(requestId);
  }
};

type FetchAndParseFunction = (
  url: string,
  signal?: AbortSignal | undefined,
  requiresFunction?: Record<string, any>,
) => Promise<UnknownBlock>;

type CreateFetchAndParseFunction = (
  fetchSourceFunction: FetchSourceFunction,
) => FetchAndParseFunction;

/**
 * Creates a function to fetch and parse a source file, allowing for different functions for _fetching_ to be used.
 * @param fetchSourceFunction the function to fetch the source
 */
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
      const exports: Record<string, UnknownBlock> = {};
      const module = { exports };
      // eslint-disable-next-line no-new-func
      const func = new Function("require", "module", "exports", source);
      func(requiresFunction, module, exports);

      if (!("exports" in module)) {
        throw new Error(`Parsed block module does not contain 'exports'.`);
      }

      if (module.exports.default) {
        return exports.default;
      } else if (module.exports.App) {
        return exports.App;
      } else if (Object.keys(exports).length === 1) {
        return exports[Object.keys(exports)[0]!]!;
      }

      throw new Error(
        "Block component must be exported as default, App, or the only named export in the source file.",
      );
    });

/*
 * Memoizes the result of a fetch function by URL.
 * @todo we probably don't need both this and remoteModuleCache in useRemoteBlock
 */
const memoizeFetchFunction = (
  fetchFunction: FetchAndParseFunction,
): FetchAndParseFunction => {
  const cache: Record<string, Promise<any>> = {};

  return async (url, signal, ...args) => {
    if (cache[url] == null) {
      let fulfilled = false;
      const promise = fetchFunction(url, signal, ...args);

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

export const loadRemoteBlock = memoizeFetchFunction(
  createFetchAndParseBlockFunction(defaultTextFetchFunction),
);

export const loadCrossFrameRemoteBlock = memoizeFetchFunction(
  createFetchAndParseBlockFunction(crossFrameTextFetchRequestFunction),
);
