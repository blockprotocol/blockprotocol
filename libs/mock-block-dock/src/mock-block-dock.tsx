import { HtmlBlockDefinition } from "@blockprotocol/core";
import {
  BlockGraphProperties,
  Entity,
  EntityEditionId,
} from "@blockprotocol/graph";
import { useGraphEmbedderService } from "@blockprotocol/graph/react";
import { EmbedderHookMessageCallbacks, HookData } from "@blockprotocol/hook/.";
import { useHookEmbedderService } from "@blockprotocol/hook/react";
import {
  ComponentType,
  FunctionComponent,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuid } from "uuid";

import { BlockRenderer } from "./block-renderer";
import { getEntity } from "./datastore/hook-implementations/entity/get-entity";
import { HookPortals } from "./hook-portals";
import { MockBlockDockProvider } from "./mock-block-dock-context";
import { useDefaultState } from "./use-default-state";
import { useMockBlockProps } from "./use-mock-block-props";
import { useSendGraphValue } from "./use-send-graph-value";

const MockBlockDockUi = lazy(async () => ({
  default: (await import("./mock-block-dock-ui")).MockBlockDockUi,
}));

type BlockDefinition =
  | { ReactComponent: ComponentType<any> }
  | {
      customElement: {
        elementClass: typeof HTMLElement;
        tagName: string;
      };
    }
  | {
      html: HtmlBlockDefinition;
    };

type MockBlockDockProps = {
  blockDefinition: BlockDefinition;
  blockEntityEditionId?: EntityEditionId;
  debug?: boolean;
  hideDebugToggle?: boolean;
  initialEntities?: Entity[];
  // initialLinkedAggregations?: LinkedAggregationDefinition[];
  readonly?: boolean;
  blockInfo?: {
    blockType: {
      entryPoint: "react" | "html" | "custom-element" | string;
    };
    displayName: string;
    icon: string;
    image: string;
    name: string;
    protocol: string;
  };
};

/**
 * A component which acts as a mock embedding application for Block Protocol blocks.
 * It provides the functionality specified in the Block Protocol, and mock data which can be customized via props.
 * See README.md for usage instructions.
 * @param props component props
 * @param props.blockDefinition the source for the block and any additional metadata required
 * @param [props.blockEntityEditionId] the `EntityEditionId` of the starting block entity
 * @param [props.blockInfo] metadata about the block
 * @param [props.debug=false] display debugging information
 * @param [props.hideDebugToggle=false] hide the ability to toggle the debug UI
 * @param [props.initialEntities] the entities to include in the data store (NOT the block entity, which is always provided)
 * @param [props.initialLinkedAggregations] The linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 * @param [props.readonly=false] whether the block should display in readonly mode or not
 */
export const MockBlockDock: FunctionComponent<MockBlockDockProps> = ({
  blockDefinition,
  blockEntityEditionId: initialBlockEntityEditionId,
  blockInfo,
  debug: initialDebug = false,
  hideDebugToggle = false,
  initialEntities,
  // initialLinkedAggregations,
  readonly: initialReadonly = false,
}) => {
  const {
    blockEntityEditionId,
    mockDatastore,
    // linkedAggregations,
    readonly,
    setEntityEditionIdOfEntityForBlock,
    setReadonly,
  } = useMockBlockProps({
    blockEntityEditionId: initialBlockEntityEditionId,
    initialEntities,
    // initialLinkedAggregations,
    readonly: !!initialReadonly,
  });

  const [debugMode, setDebugMode] = useDefaultState<boolean>(initialDebug);

  const [hooks, setHooks] = useState<Map<string, HookData>>(new Map());

  const wrapperRef = useRef<HTMLDivElement>(null);

  const blockEntitySubgraph = getEntity(
    {
      entityId: blockEntityEditionId.baseId,
      graphResolveDepths: {
        hasLeftEntity: { incoming: 2, outgoing: 2 },
        hasRightEntity: { incoming: 2, outgoing: 2 },
      },
    },
    mockDatastore.graph,
  );

  if (!blockEntitySubgraph) {
    throw new Error(`Failed to get subgraph for block entity`);
  }

  const blockType =
    "ReactComponent" in blockDefinition
      ? "react"
      : "customElement" in blockDefinition
      ? "custom-element"
      : "html" in blockDefinition
      ? "html"
      : undefined;

  const propsToInject: BlockGraphProperties = {
    graph: {
      blockEntitySubgraph,
      readonly,
      // linkedAggregations,
    },
  };

  const { graphServiceCallbacks } = mockDatastore;

  const { graphService } = useGraphEmbedderService(wrapperRef, {
    blockEntitySubgraph,
    // linkedAggregations,
    callbacks: graphServiceCallbacks,
    readonly,
  });

  const hookCallback = useCallback<EmbedderHookMessageCallbacks["hook"]>(
    async ({ data }) => {
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

      if (data?.type === "text") {
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
    [hooks, setHooks],
  );

  const { hookService } = useHookEmbedderService(wrapperRef, {
    callbacks: {
      hook: hookCallback,
    },
  });

  useEffect(() => {
    if (hookService) {
      hookService.on("hook", hookCallback);
    }
  }, [hookCallback, hookService]);

  useSendGraphValue({
    graphService,
    value: blockEntitySubgraph,
    valueName: "blockEntitySubgraph",
  });
  // useSendGraphValue({
  //   graphService,
  //   value: linkedAggregations,
  //   valueName: "linkedAggregations",
  // });
  useSendGraphValue({
    graphService,
    value: readonly,
    valueName: "readonly",
  });

  useEffect(() => {
    if (graphService) {
      // The callbacks are reconstructed when the data in the store changes
      // We need to register the updated callbacks or the data they use will be stale
      try {
        graphService.registerCallbacks(graphServiceCallbacks);
      } catch {
        /**
         * Registration can error when the user switches between preview and debug mode.
         * Registration is attempted with the old service, which has been destroyed.
         * It then succeeds with the new one.
         * @todo can we avoid this error?
         */
      }
    }
  }, [graphService, graphServiceCallbacks]);

  const blockRenderer = graphService ? (
    <BlockRenderer
      customElement={
        "customElement" in blockDefinition
          ? blockDefinition.customElement
          : undefined
      }
      html={"html" in blockDefinition ? blockDefinition.html : undefined}
      properties={propsToInject}
      ReactComponent={
        "ReactComponent" in blockDefinition
          ? blockDefinition.ReactComponent
          : undefined
      }
    />
  ) : null;

  return (
    <MockBlockDockProvider
      blockEntitySubgraph={blockEntitySubgraph}
      blockInfo={
        blockInfo ?? {
          blockType: {
            entryPoint: blockType,
          },
        }
      }
      graph={mockDatastore.graph}
      debugMode={debugMode}
      readonly={readonly}
      setReadonly={setReadonly}
      setDebugMode={setDebugMode}
      setEntityEditionIdOfEntityForBlock={setEntityEditionIdOfEntityForBlock}
      updateEntity={graphServiceCallbacks.updateEntity}
    >
      <HookPortals hooks={hooks} />
      <div ref={wrapperRef}>
        <Suspense>
          {hideDebugToggle && !debugMode ? (
            blockRenderer
          ) : (
            <MockBlockDockUi>{blockRenderer}</MockBlockDockUi>
          )}
        </Suspense>
      </div>
    </MockBlockDockProvider>
  );
};
