import { useCallback, useEffect, useRef, VoidFunctionComponent } from "react";

import { ExpandedBlockMetadata } from "../../../lib/blocks";

export interface SandboxedBlockProps {
  metadata: ExpandedBlockMetadata;
  props: Record<string, unknown> | undefined;
}

export const SandboxedBlockDemo: VoidFunctionComponent<SandboxedBlockProps> = ({
  metadata,
  props,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const postBlockProps = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(props), "*");
  }, [props]);

  useEffect(() => {
    postBlockProps();
  }, [postBlockProps]);

  const aliasBaseUrl = ""; // @todo

  const sandboxedDemoUrl = `${aliasBaseUrl}/${metadata.packagePath.replace(
    "/",
    "/blocks/",
  )}/sandboxed-demo`;

  return (
    <iframe
      ref={iframeRef}
      title="block"
      src={sandboxedDemoUrl}
      sandbox="allow-forms allow-scripts allow-same-origin"
      onLoad={() => {
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
