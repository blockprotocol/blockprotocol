import { useCallback, useEffect, useRef, useState } from "react";
import {
  crossFrameTextFetchResponseHandler,
  loadCrossFrameRemoteBlock,
  loadRemoteBlock,
} from "./loadRemoteBlock";
import { UnknownBlock } from "./shared";

type UseRemoteBlockHook = {
  (
    url: string,
    crossFrame?: boolean,
    onBlockLoaded?: () => void,
    externalDependencies?: Record<string, any>,
  ): [boolean, Error | undefined, UnknownBlock | undefined];
};

type UseRemoteComponentState = {
  loading: boolean;
  err?: Error | undefined;
  component?: UnknownBlock | undefined;
  url: string | null;
};

const remoteModuleCache: Record<string, UseRemoteComponentState> = {};

export const isTopWindow = () => {
  try {
    return window.top === window.self;
  } catch {
    return false;
  }
};

/**
 * @see https://github.com/Paciolan/remote-component/blob/master/src/hooks/useRemoteComponent.ts
 */
export const useRemoteBlock: UseRemoteBlockHook = (
  url,
  crossFrame,
  onBlockLoaded,
  externalDependencies,
) => {
  if (crossFrame && isTopWindow()) {
    throw new Error(
      "crossFrame passed to useRemoteBlock from top window. This should be set from framed windows only.",
    );
  }

  const [{ loading, err, component, url: loadedUrl }, setState] =
    useState<UseRemoteComponentState>(
      remoteModuleCache[url] ?? {
        loading: true,
        err: undefined,
        component: undefined,
        url: null,
      },
    );

  useEffect(() => {
    if (!loading && !err) {
      remoteModuleCache[url] = { loading, err, component, url };
    }
  });

  const onBlockLoadedRef = useRef<() => void>();
  useEffect(() => {
    onBlockLoadedRef.current = onBlockLoaded;
  });

  useEffect(() => {
    if (!crossFrame) {
      return;
    }

    window.addEventListener("message", crossFrameTextFetchResponseHandler);

    return () =>
      window.removeEventListener("message", crossFrameTextFetchResponseHandler);
  }, [crossFrame]);

  const requiresFunction = useCallback(
    (name: string) => {
      if (!externalDependencies) {
        throw new Error(
          `Could not require '${name}: no externalDependencies provided to useRemoteBlock.`,
        );
      }
      if (!(name in externalDependencies)) {
        throw new Error(
          `Could not require '${name}'. '${name}' does not exist in dependencies.`,
        );
      }

      return externalDependencies[name];
    },
    [externalDependencies],
  );

  useEffect(() => {
    if (url === loadedUrl && !loading && !err) {
      return;
    }

    let update = setState;
    const controller = new AbortController();
    const signal = controller.signal;

    update({ loading: true, err: undefined, component: undefined, url: null });

    const blockLoaderFn = crossFrame
      ? loadCrossFrameRemoteBlock
      : loadRemoteBlock;

    blockLoaderFn(url, signal, requiresFunction)
      .then((fetchedComponent) => {
        update({
          loading: false,
          err: undefined,
          component: fetchedComponent,
          url,
        });

        if (onBlockLoadedRef.current && !signal.aborted) {
          onBlockLoadedRef.current();
        }
      })
      .catch((newErr) =>
        update({
          loading: false,
          err: newErr,
          component: undefined,
          url: null,
        }),
      );

    return () => {
      controller.abort();

      update = () => {};
    };
  }, [
    err,
    crossFrame,
    loadedUrl,
    loading,
    onBlockLoaded,
    requiresFunction,
    url,
  ]);

  return [loading, err, component];
};
