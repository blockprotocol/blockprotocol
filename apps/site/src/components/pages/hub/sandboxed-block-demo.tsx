import { ExternalServiceMethodRequest } from "@local/internal-api-client/api";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { ServiceModuleModal } from "./sandboxed-block-demo/service-module-modal";

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

  const [serviceModuleMessage, setServiceModuleMessage] =
    useState<ExternalServiceMethodRequest | null>(null);

  const postBlockProps = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(props), "*");
  }, [props]);

  useEffect(() => {
    const listener = (message: MessageEvent) => {
      if (sandboxBaseUrl && message.origin !== sandboxBaseUrl) {
        return;
      }

      if (message.data.type === "serviceModule") {
        const { providerName, methodName, payload } = message.data;
        setServiceModuleMessage({ providerName, methodName, payload });
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
    <>
      <ServiceModuleModal
        onClose={() => setServiceModuleMessage(null)}
        serviceModuleMessage={serviceModuleMessage}
      />

      <iframe
        ref={iframeRef}
        title="block"
        src={sandboxedDemoUrl}
        sandbox="allow-forms allow-scripts allow-same-origin"
        allow="clipboard-write"
        onLoad={() => {
          // @todo-0.3 this isn't triggering – why not?
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
    </>
  );
};
