import { ServiceEmbedderMessageCallbacks } from "@blockprotocol/service";
import { ExternalServiceMethodRequest } from "@local/internal-api-client/api";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { apiClient } from "../../../../lib/api-client";
import { ExpandedBlockMetadata } from "../../../../lib/blocks";
import { ServiceModuleModal } from "./sandboxed-block-demo/service-module-modal";

export interface SandboxedBlockProps {
  metadata: ExpandedBlockMetadata;
  props: Record<string, unknown> | undefined;
  sandboxBaseUrl: string;
}

const serviceModuleMessageTypeName = "serviceModule";

type ServiceModuleMessageState = ExternalServiceMethodRequest & {
  process: () => Promise<void>;
  reject: () => void;
};

export const SandboxedBlockDemo: FunctionComponent<SandboxedBlockProps> = ({
  metadata,
  props,
  sandboxBaseUrl,
}) => {
  const loadedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [serviceUsageIsPermitted, setServiceUsageIsPermitted] = useState<
    boolean | undefined
  >(undefined);

  const [serviceModuleMessage, setServiceModuleMessage] =
    useState<ServiceModuleMessageState | null>(null);

  const postBlockProps = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "blockEntityProps",
        payload: props,
      },
      "*",
    );
  }, [props]);

  const postServiceModuleResponse = useCallback(
    (
      payload: Awaited<
        ReturnType<
          ServiceEmbedderMessageCallbacks[keyof ServiceEmbedderMessageCallbacks]
        >
      >,
      requestId: string,
    ) => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: serviceModuleMessageTypeName,
          payload,
          requestId,
        },
        "*",
      );
    },
    [],
  );

  useEffect(() => {
    const listener = (message: MessageEvent) => {
      if (sandboxBaseUrl && message.origin !== sandboxBaseUrl) {
        return;
      }

      if (message.data.type === serviceModuleMessageTypeName) {
        const { methodName, payload, providerName, requestId } = message.data;

        const process = async () => {
          try {
            const { data: response } = await apiClient.externalServiceMethod({
              methodName,
              payload,
              providerName: providerName.toLowerCase(),
            });
            if (response?.externalServiceMethodResponse) {
              postServiceModuleResponse(
                { data: response.externalServiceMethodResponse },
                requestId,
              );
            }
            throw new Error("No data provided by service");
          } catch (error) {
            postServiceModuleResponse(
              {
                errors: [
                  {
                    code: "INTERNAL_ERROR",
                    message: (error as Error).message,
                  },
                ],
              },
              requestId,
            );
          }
        };

        const reject = () => {
          postServiceModuleResponse(
            {
              errors: [
                {
                  code: "FORBIDDEN",
                  message: "You are not permitted to use this service",
                },
              ],
            },
            requestId,
          );
        };

        if (serviceUsageIsPermitted === undefined) {
          setServiceModuleMessage({
            methodName,
            payload,
            process,
            providerName,
            reject,
          });
        } else if (serviceUsageIsPermitted) {
          void process();
        } else {
          reject();
        }
      }
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [
    metadata.pathWithNamespace,
    postServiceModuleResponse,
    sandboxBaseUrl,
    serviceUsageIsPermitted,
  ]);

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
        setServiceUsagePermission={(allowed: boolean) => {
          setServiceUsageIsPermitted(allowed);
          if (allowed) {
            void serviceModuleMessage?.process();
          } else {
            void serviceModuleMessage?.reject();
          }
        }}
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
