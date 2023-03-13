import {
  BlockGraphProperties,
  EntityRootType,
  GraphEmbedderMessageCallbacks,
  Subgraph,
} from "@blockprotocol/graph";
import { useGraphEmbedderModule } from "@blockprotocol/graph/react";
import { HookData } from "@blockprotocol/hook";
import { useHookEmbedderModule } from "@blockprotocol/hook/react";
import { ServiceEmbedderMessageCallbacks } from "@blockprotocol/service";
import { useServiceEmbedderModule } from "@blockprotocol/service/react";
import { FunctionComponent, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import { BlockRenderer } from "./block-loader/block-renderer";
import { HookPortals } from "./block-loader/hook-portals";
import { parseBlockSource } from "./block-loader/load-remote-block";
import { useRemoteBlock } from "./block-loader/use-remote-block";

type BlockLoaderProps =
  | {
      blockName: string;
      entitySubgraph: Subgraph<EntityRootType>;
      LoadingImage: FunctionComponent<{ height: string }>;
      sourceString?: string;
      sourceUrl: string;
    } & (
      | {
          readonly: false;
          callbacks: {
            graph: Required<
              Pick<
                GraphEmbedderMessageCallbacks,
                | "createEntity"
                | "deleteEntity"
                | "getEntity"
                | "queryEntities"
                | "updateEntity"
                | "uploadFile"
              >
            >;
            service: Required<ServiceEmbedderMessageCallbacks>;
          };
        }
      | {
          readonly: true;
          callbacks: {
            graph: Required<Pick<GraphEmbedderMessageCallbacks, "getEntity">>;
          };
        }
    );

/**
 * Sets up the Block Protocol module message handlers and renders the block.
 *
 * Shared between the admin view (edit.tsx) and end-user facing page (render.tsx)
 */
export const BlockLoader = ({
  blockName,
  callbacks,
  entitySubgraph,
  LoadingImage,
  readonly = false,
  sourceString,
  sourceUrl,
}: BlockLoaderProps) => {
  const blockWrapperRef = useRef<HTMLDivElement>(null);

  const [hooks, setHooks] = useState<Map<string, HookData>>(new Map());

  if (!sourceString && !sourceUrl) {
    // eslint-disable-next-line no-console -- log to help debug user issues (this should not happen)
    console.error("Source code missing from block");
    throw new Error("Could not load block – source code missing");
  }

  const [loading, err, blockSource] = sourceString
    ? // eslint-disable-next-line react-hooks/rules-of-hooks -- will be consistent across lifetime. TODO split out
      useMemo(() => {
        return [false, null, parseBlockSource(sourceString, sourceUrl)];
      }, [sourceString, sourceUrl])
    : // eslint-disable-next-line react-hooks/rules-of-hooks -- will be consistent across lifetime. TODO split out
      useRemoteBlock(sourceUrl);

  // The hook module allows blocks to request that the application takes over rendering/editing of elements
  // e.g. so that the application can inject its own view/inputs for rich text or media
  const { hookModule } = useHookEmbedderModule(blockWrapperRef, {
    callbacks: {
      hook: async ({ data }) => {
        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "Data is required with hook",
              },
            ],
          };
        }
        const { hookId, node, type } = data;

        if (hookId) {
          const existingHook = hooks.get(hookId);
          if (!existingHook) {
            return {
              errors: [
                {
                  code: "NOT_FOUND",
                  message: `Hook with id ${hookId} not found`,
                },
              ],
            };
          }
        }

        if (node === null && hookId) {
          setHooks((currentHooks) => {
            const draftHooks = new Map(currentHooks);
            draftHooks.delete(hookId);
            return draftHooks;
          });
          return { data: { hookId } };
        }

        if (data?.type === "text" || data?.type === "image") {
          const hookIdForReturn = hookId ?? uuid();

          setHooks((currentHooks) => {
            const draftHooks = new Map(currentHooks);
            draftHooks.set(hookIdForReturn, {
              ...data,
              hookId: hookIdForReturn,
            });
            return draftHooks;
          });

          return { data: { hookId: hookIdForReturn } };
        }

        return {
          errors: [
            {
              code: "NOT_IMPLEMENTED",
              message: `Hook type ${type} not supported`,
            },
          ],
        };
      },
    },
  });

  const graphProperties = useMemo<BlockGraphProperties>(() => {
    return {
      graph: {
        blockEntitySubgraph: entitySubgraph,
        readonly,
      },
    };
  }, [entitySubgraph, readonly]);

  // The graph module allows for retrieval, creation and modification of entities and links between them
  const { graphModule } = useGraphEmbedderModule(blockWrapperRef, {
    ...graphProperties.graph,
    callbacks: callbacks.graph,
  });

  useServiceEmbedderModule(blockWrapperRef, {
    callbacks: "service" in callbacks ? callbacks.service : {},
  });

  if (loading) {
    return <LoadingImage height="8rem" />;
  }

  if (!blockSource || err) {
    // eslint-disable-next-line no-console -- log to help debug user issues
    console.error(
      `Could not load and parse block from URL${err ? `: ${err.message}` : ""}`,
    );
    return (
      <span>
        Could not load block – the URL may be unavailable or the source
        unreadable
      </span>
    );
  }

  return (
    <div ref={blockWrapperRef}>
      <HookPortals hooks={hooks} readonly={readonly} />
      {graphModule && hookModule ? (
        <BlockRenderer
          blockName={blockName}
          blockSource={blockSource}
          properties={graphProperties}
          sourceUrl={sourceUrl}
        />
      ) : null}
    </div>
  );
};
