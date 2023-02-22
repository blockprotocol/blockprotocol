import { FunctionComponent, useCallback, useEffect, useRef } from "react";

import { ExpandedBlockMetadata } from "../../../lib/blocks";

export interface SandboxedBlockProps {
  metadata: ExpandedBlockMetadata;
  props: Record<string, unknown> | undefined;
  sandboxBaseUrl: string;
}

export const SandboxedBlockDemo: FunctionComponent<SandboxedBlockProps> = ({
  metadata,
  props,
  sandboxBaseUrl,
}) => {
  const loadedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const postBlockProps = useCallback(() => {
    if (loadedRef.current) {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify(props), "*");
    }
  }, [props]);

  useEffect(() => {
    postBlockProps();
  }, [postBlockProps]);

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
        loadedRef.current = true;
        postBlockProps();
      }}
      // todo: remove 100% after implementing viewport negotiation
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
