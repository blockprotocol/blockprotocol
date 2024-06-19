import { useEffect, useRef, useState } from "react";

import { loadRemoteBlock, UnknownBlock } from "./load-remote-block";

type UseRemoteBlockHook = {
  (url: string): [boolean, Error | undefined, UnknownBlock | undefined];
};

type UseRemoteComponentState = {
  loading: boolean;
  err?: Error | undefined;
  component?: UnknownBlock | undefined;
  url: string | null;
};

const remoteModuleCache: Record<string, UseRemoteComponentState> = {};

export const loadBlockComponent = (sourceUrl: string, signal?: AbortSignal) => {
  return loadRemoteBlock(sourceUrl, signal).then((component) => {
    remoteModuleCache[sourceUrl] = {
      loading: false,
      err: undefined,
      component,
      url: sourceUrl,
    };

    return remoteModuleCache[sourceUrl]!;
  });
};

/**
 * @see https://github.com/Paciolan/remote-component/blob/master/src/hooks/useRemoteComponent.ts
 */
export const useRemoteBlock: UseRemoteBlockHook = (url) => {
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

  const loadedRef = useRef(false);

  useEffect(() => {
    if (url === loadedUrl && !loading && !err) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    loadedRef.current = false;

    setState({
      loading: true,
      err: undefined,
      component: undefined,
      url: null,
    });

    loadBlockComponent(url, signal)
      .then((result) => {
        setState(result);
      })
      .catch((newErr) => {
        if (!controller.signal.aborted) {
          setState({
            loading: false,
            err: newErr,
            component: undefined,
            url: null,
          });
        }
      });

    return () => {
      controller.abort();
    };
  }, [err, loading, url, loadedUrl]);

  return [loading, err, component];
};
