import { HtmlBlockDefinition } from "@blockprotocol/core";
import { EntityRecordId } from "@blockprotocol/graph";
import { useGraphEmbedderModule as useGraphEmbedderModuleNonTemporal } from "@blockprotocol/graph/react";
import { useGraphEmbedderModule as useGraphEmbedderModuleTemporal } from "@blockprotocol/graph/temporal/react";
import { HookData, HookEmbedderMessageCallbacks } from "@blockprotocol/hook/.";
import { useHookEmbedderModule } from "@blockprotocol/hook/react";
import { EmbedderServiceMessageCallbacks } from "@blockprotocol/service";
import { useServiceEmbedderModule } from "@blockprotocol/service/react";
import {
  ComponentType,
  FunctionComponent,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 as uuid } from "uuid";

import { BlockRenderer } from "./block-renderer";
import { getDefaultTemporalAxes } from "./datastore/get-default-temporal-axes";
import { getEntity } from "./datastore/hook-implementations/entity/get-entity";
import { HookPortals } from "./hook-portals";
import { MockBlockDockProvider } from "./mock-block-dock-context";
import { constructServiceModuleCallbacks } from "./service-module-callbacks";
import { useDefaultState } from "./use-default-state";
import {
  InitialData,
  useMockBlockPropsNonTemporal,
  useMockBlockPropsTemporal,
} from "./use-mock-block-props";
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

type MockBlockDockProps<Temporal extends boolean> = {
  blockDefinition: BlockDefinition;
  blockEntityRecordId?: EntityRecordId;
  blockProtocolApiKey?: string;
  blockProtocolSiteHost?: string;
  temporal?: Temporal;
  debug?: boolean;
  hideDebugToggle?: boolean;
  initialData?: InitialData<Temporal>;
  readonly?: boolean;
  serviceModuleCallbacks?: EmbedderServiceMessageCallbacks;
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

const MockBlockDockNonTemporal: FunctionComponent<
  Omit<MockBlockDockProps<false>, "temporal">
> = ({
  blockDefinition,
  blockEntityRecordId: initialBlockEntityRecordId,
  blockInfo,
  blockProtocolApiKey,
  blockProtocolSiteHost,
  debug: initialDebug = false,
  hideDebugToggle = false,
  initialData,
  readonly: initialReadonly = false,
  serviceModuleCallbacks: serviceModuleCallbacksFromProps,
}: Omit<MockBlockDockProps<false>, "temporal">) => {
  const {
    blockEntityRecordId,
    mockDatastore,
    // linkedQueries,
    readonly,
    setEntityRecordIdOfEntityForBlock,
    setReadonly,
  } = useMockBlockPropsNonTemporal({
    blockEntityRecordId: initialBlockEntityRecordId,
    initialData: initialData as InitialData<false>,
    readonly: !!initialReadonly,
  });

  const [debugMode, setDebugMode] = useDefaultState<boolean>(initialDebug);

  const [hooks, setHooks] = useState<Map<string, HookData>>(new Map());

  const wrapperRef = useRef<HTMLDivElement>(null);

  const blockEntitySubgraph = getEntity<false>(
    {
      entityId: blockEntityRecordId.entityId,
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

  const propsToInject = {
    graph: {
      blockEntitySubgraph,
      readonly,
      // linkedQueries,
    },
  };

  const { graphModuleCallbacks } = mockDatastore;

  const { graphModule } = useGraphEmbedderModuleNonTemporal(wrapperRef, {
    blockEntitySubgraph,
    // linkedQueries,
    callbacks: graphModuleCallbacks,
    readonly,
  });

  const serviceModuleCallbacks = useMemo(
    () =>
      serviceModuleCallbacksFromProps ??
      constructServiceModuleCallbacks({
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),
    [
      blockProtocolApiKey,
      blockProtocolSiteHost,
      serviceModuleCallbacksFromProps,
    ],
  );

  useServiceEmbedderModule(wrapperRef, {
    callbacks: serviceModuleCallbacks,
  });

  const hookCallback = useCallback<HookEmbedderMessageCallbacks["hook"]>(
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

  const { hookModule } = useHookEmbedderModule(wrapperRef, {
    callbacks: {
      hook: hookCallback,
    },
  });

  useEffect(() => {
    if (hookModule) {
      hookModule.on("hook", hookCallback);
    }
  }, [hookCallback, hookModule]);

  useSendGraphValue<false>({
    graphModule,
    value: blockEntitySubgraph,
    valueName: "blockEntitySubgraph",
  });
  // useSendGraphValue<false>({
  //   graphModule,
  //   value: linkedQueries,
  //   valueName: "linkedQueries",
  // });
  useSendGraphValue<false>({
    graphModule,
    value: readonly,
    valueName: "readonly",
  });

  useEffect(() => {
    if (graphModule) {
      // The callbacks are reconstructed when the data in the store changes
      // We need to register the updated callbacks or the data they use will be stale
      try {
        graphModule.registerCallbacks(graphModuleCallbacks);
      } catch {
        /**
         * Registration can error when the user switches between preview and debug mode.
         * Registration is attempted with the old module, which has been destroyed.
         * It then succeeds with the new one.
         * @todo can we avoid this error?
         */
      }
    }
  }, [graphModule, graphModuleCallbacks]);

  const blockRenderer = graphModule ? (
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
      setEntityRecordIdOfEntityForBlock={setEntityRecordIdOfEntityForBlock}
      updateEntity={graphModuleCallbacks.updateEntity}
    >
      <HookPortals temporal={false} hooks={hooks} />
      <div ref={wrapperRef}>
        <Suspense>
          {hideDebugToggle && !debugMode ? (
            blockRenderer
          ) : (
            <MockBlockDockUi temporal={false}>{blockRenderer}</MockBlockDockUi>
          )}
        </Suspense>
      </div>
    </MockBlockDockProvider>
  );
};

const MockBlockDockTemporal: FunctionComponent<
  Omit<MockBlockDockProps<true>, "temporal">
> = ({
  blockDefinition,
  blockEntityRecordId: initialBlockEntityRecordId,
  blockInfo,
  blockProtocolApiKey,
  blockProtocolSiteHost,
  debug: initialDebug = false,
  hideDebugToggle = false,
  initialData,
  readonly: initialReadonly = false,
  serviceModuleCallbacks: serviceModuleCallbacksFromProps,
}: Omit<MockBlockDockProps<true>, "temporal">) => {
  const {
    blockEntityRecordId,
    mockDatastore,
    // linkedQueries,
    readonly,
    setEntityRecordIdOfEntityForBlock,
    setReadonly,
  } = useMockBlockPropsTemporal({
    blockEntityRecordId: initialBlockEntityRecordId,
    initialData: initialData as InitialData<true>,
    readonly: !!initialReadonly,
  });

  const [debugMode, setDebugMode] = useDefaultState<boolean>(initialDebug);

  const [hooks, setHooks] = useState<Map<string, HookData>>(new Map());

  const wrapperRef = useRef<HTMLDivElement>(null);

  const blockEntitySubgraph = getEntity<true>(
    {
      entityId: blockEntityRecordId.entityId,
      graphResolveDepths: {
        hasLeftEntity: { incoming: 2, outgoing: 2 },
        hasRightEntity: { incoming: 2, outgoing: 2 },
      },
      temporalAxes: getDefaultTemporalAxes(),
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

  const propsToInject = {
    graph: {
      blockEntitySubgraph,
      readonly,
      // linkedQueries,
    },
  };

  const { graphModuleCallbacks } = mockDatastore;

  const { graphModule } = useGraphEmbedderModuleTemporal(wrapperRef, {
    blockEntitySubgraph,
    // linkedQueries,
    callbacks: graphModuleCallbacks,
    readonly,
  });

  const serviceModuleCallbacks = useMemo(
    () =>
      serviceModuleCallbacksFromProps ??
      constructServiceModuleCallbacks({
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),
    [
      blockProtocolApiKey,
      blockProtocolSiteHost,
      serviceModuleCallbacksFromProps,
    ],
  );

  useServiceEmbedderModule(wrapperRef, {
    callbacks: serviceModuleCallbacks,
  });

  const hookCallback = useCallback<HookEmbedderMessageCallbacks["hook"]>(
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

  const { hookModule } = useHookEmbedderModule(wrapperRef, {
    callbacks: {
      hook: hookCallback,
    },
  });

  useEffect(() => {
    if (hookModule) {
      hookModule.on("hook", hookCallback);
    }
  }, [hookCallback, hookModule]);

  useSendGraphValue<true>({
    graphModule,
    value: blockEntitySubgraph,
    valueName: "blockEntitySubgraph",
  });
  // useSendGraphValue<true>({
  //   graphModule,
  //   value: linkedQueries,
  //   valueName: "linkedQueries",
  // });
  useSendGraphValue<true>({
    graphModule,
    value: readonly,
    valueName: "readonly",
  });

  useEffect(() => {
    if (graphModule) {
      // The callbacks are reconstructed when the data in the store changes
      // We need to register the updated callbacks or the data they use will be stale
      try {
        graphModule.registerCallbacks(graphModuleCallbacks);
      } catch {
        /**
         * Registration can error when the user switches between preview and debug mode.
         * Registration is attempted with the old module, which has been destroyed.
         * It then succeeds with the new one.
         * @todo can we avoid this error?
         */
      }
    }
  }, [graphModule, graphModuleCallbacks]);

  const blockRenderer = graphModule ? (
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
      setEntityRecordIdOfEntityForBlock={setEntityRecordIdOfEntityForBlock}
      updateEntity={graphModuleCallbacks.updateEntity}
    >
      <HookPortals temporal hooks={hooks} />
      <div ref={wrapperRef}>
        <Suspense>
          {hideDebugToggle && !debugMode ? (
            blockRenderer
          ) : (
            <MockBlockDockUi temporal>{blockRenderer}</MockBlockDockUi>
          )}
        </Suspense>
      </div>
    </MockBlockDockProvider>
  );
};

/**
 * A component which acts as a mock embedding application for Block Protocol blocks.
 * It provides the functionality specified in the Block Protocol, and mock data which can be customized via props.
 * See README.md for usage instructions.
 * @param props component props
 * @param props.blockDefinition the source for the block and any additional metadata required
 * @param [props.blockEntityRecordId] the `EntityRecordId` of the starting block entity
 * @param [props.blockInfo] metadata about the block
 * @param [props.blockProtocolApiKey] the Block Protocol API Key
 * @param [props.blockProtocolSiteHost] the origin of the Block Protocol server (defaults to https://blockprotocol.org)
 * @param [props.debug=false] display debugging information
 * @param [props.hideDebugToggle=false] hide the ability to toggle the debug UI
 * @param [props.initialData.initialEntities] - The entities to include in the data store (NOT the block entity, which is always provided)
 * @param [props.initialData.initialTemporalAxes] - The temporal axes that were used in creating the initial entities
 * @param [props.initialData.initialLinkedQueries] - The linkedQuery DEFINITIONS to include in the data store (results will be resolved automatically)
 * @param [props.readonly=false] whether the block should display in readonly mode or not
 * @param [props.serviceModuleCallbacks] overrides the default service module callbacks
 */
export const MockBlockDock: FunctionComponent<MockBlockDockProps<boolean>> = <
  Temporal extends boolean,
>({
  blockDefinition,
  blockEntityRecordId: initialBlockEntityRecordId,
  blockInfo,
  blockProtocolApiKey,
  blockProtocolSiteHost,
  temporal,
  debug: initialDebug = false,
  hideDebugToggle = false,
  initialData,
  readonly: initialReadonly = false,
  serviceModuleCallbacks,
}: MockBlockDockProps<Temporal>) => {
  return temporal ? (
    <MockBlockDockTemporal
      blockDefinition={blockDefinition}
      blockEntityRecordId={initialBlockEntityRecordId}
      blockInfo={blockInfo}
      blockProtocolApiKey={blockProtocolApiKey}
      blockProtocolSiteHost={blockProtocolSiteHost}
      debug={initialDebug}
      hideDebugToggle={hideDebugToggle}
      initialData={initialData as InitialData<true>}
      readonly={initialReadonly}
      serviceModuleCallbacks={serviceModuleCallbacks}
    />
  ) : (
    <MockBlockDockNonTemporal
      blockDefinition={blockDefinition}
      blockEntityRecordId={initialBlockEntityRecordId}
      blockInfo={blockInfo}
      blockProtocolApiKey={blockProtocolApiKey}
      blockProtocolSiteHost={blockProtocolSiteHost}
      debug={initialDebug}
      hideDebugToggle={hideDebugToggle}
      initialData={initialData}
      readonly={initialReadonly}
      serviceModuleCallbacks={serviceModuleCallbacks}
    />
  );
};
