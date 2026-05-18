import { FunctionComponent, useCallback, useEffect, useRef } from "react";

import { ExpandedBlockMetadata } from "../../../../lib/blocks";

export interface SandboxedBlockProps {
  metadata: ExpandedBlockMetadata;
  props: Record<string, unknown> | undefined;
  sandboxBaseUrl: string;
}

const serviceModuleMessageTypeName = "serviceModule";

/**
 * Sandboxed block previews used to be able to call into a server-side
 * external-service proxy that required a logged-in Block Protocol account.
 * That account system has been removed while we focus on HASH, so we always
 * reply to service-module requests with a `FORBIDDEN` error and leave the
 * iframe to render with whatever local data it has.
 */
export const SandboxedBlockDemo: FunctionComponent<SandboxedBlockProps> = ({
  metadata,
  props,
  sandboxBaseUrl,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const postBlockProps = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "blockEntityProps",
        payload: props,
      },
      "*",
    );
  }, [props]);

  useEffect(() => {
    const listener = (message: MessageEvent) => {
      if (sandboxBaseUrl && message.origin !== sandboxBaseUrl) {
        return;
      }

      if (message.data.type === serviceModuleMessageTypeName) {
        const { requestId } = message.data;

        iframeRef.current?.contentWindow?.postMessage(
          {
            type: serviceModuleMessageTypeName,
            payload: {
              errors: [
                {
                  code: "FORBIDDEN",
                  message:
                    "External service calls are unavailable while the Block Protocol Hub is paused.",
                },
              ],
            },
            requestId,
          },
          "*",
        );
      }
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [sandboxBaseUrl]);

  useEffect(() => {
    postBlockProps();
  }, [postBlockProps, props]);

  const sandboxedDemoUrl = `${sandboxBaseUrl}/${metadata.pathWithNamespace.replace(
    "/",
    "/blocks/",
  )}/sandboxed-demo`;

  return (
    <iframe
      ref={iframeRef}
      title="block"
      src={sandboxedDemoUrl}
      sandbox="allow-forms allow-scripts allow-same-origin"
      allow="clipboard-write"
      onLoad={() => {
        postBlockProps();
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};
