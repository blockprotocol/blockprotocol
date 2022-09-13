import { HtmlBlockDefinition } from "@blockprotocol/core";
import {
  BlockGraphProperties,
  Entity,
  EntityType,
  GraphEmbedderHandler,
  Link,
  LinkedAggregationDefinition,
} from "@blockprotocol/graph";
import {
  ComponentType,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";

import { BlockRenderer } from "./block-renderer";
import { DebugView } from "./debug-view";
import { OffSwitch } from "./debug-view/icons";
import { MockBlockDockProvider } from "./mock-block-dock-context";
import { useDefaultState } from "./use-default-state";
import { useMockBlockProps } from "./use-mock-block-props";
import { useSendGraphValue } from "./use-send-graph-value";

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
  blockEntity?: Entity;
  blockSchema?: Partial<EntityType>;
  debug?: boolean;
  hideDebugToggle?: boolean;
  initialEntities?: Entity[];
  initialEntityTypes?: EntityType[];
  initialLinks?: Link[];
  initialLinkedAggregations?: LinkedAggregationDefinition[];
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
 * @param blockDefinition the source for the block and any additional metadata required
 * @param [blockEntity] the starting properties for the block entity
 * @param [blockSchema] the schema for the block entity
 * @param [debug = false] display debugging information
 * @param [hideDebugToggle = false] hide the ability to toggle the debug UI
 * @param [initialEntities] the entities to include in the data store (NOT the block entity, which is always provided)
 * @param [initialEntityTypes] the entity types to include in the data store (NOT the block's type, which is always provided)
 * @param [initialLinks] the links to include in the data store
 * @param [initialLinkedAggregations] The linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 * @param [readonly = false] whether the block should display in readonly mode or not
 * @param [blockInfo] metadata about the block
 */
export const MockBlockDock: FunctionComponent<MockBlockDockProps> = ({
  blockDefinition,
  blockEntity: initialBlockEntity,
  blockSchema: initialBlockSchema,
  blockInfo,
  debug: initialDebug = false,
  hideDebugToggle = false,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
  readonly: initialReadonly = false,
}) => {
  const {
    blockEntity,
    blockGraph,
    blockSchema,
    datastore,
    entityTypes,
    graphServiceCallbacks,
    linkedAggregations,
    readonly,
    setEntityIdOfEntityForBlock,
    setReadonly,
  } = useMockBlockProps({
    blockEntity: initialBlockEntity,
    blockSchema: initialBlockSchema,
    initialEntities,
    initialEntityTypes,
    initialLinks,
    initialLinkedAggregations,
    readonly: !!initialReadonly,
  });

  const [debugMode, setDebugMode] = useDefaultState<boolean>(initialDebug);

  const [graphService, setGraphService] = useState<GraphEmbedderHandler | null>(
    null,
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  const blockType =
    "ReactComponent" in blockDefinition
      ? "react"
      : "customElement" in blockDefinition
      ? "custom-element"
      : "html" in blockDefinition
      ? "html"
      : undefined;

  const propsToInject: BlockGraphProperties<any> = {
    graph: {
      readonly,
      blockEntity,
      blockGraph,
      entityTypes,
      linkedAggregations,
    },
  };

  useEffect(() => {
    if (!wrapperRef.current) {
      throw new Error(
        "No reference to wrapping element – cannot listen for messages from block",
      );
    } else if (!graphService) {
      setGraphService(
        new GraphEmbedderHandler({
          blockGraph,
          blockEntity,
          entityTypes,
          linkedAggregations,
          callbacks: graphServiceCallbacks,
          element: wrapperRef.current,
          readonly,
        }),
      );
    }
  }, [
    blockEntity,
    blockGraph,
    entityTypes,
    graphService,
    graphServiceCallbacks,
    linkedAggregations,
    readonly,
  ]);

  useSendGraphValue({
    graphService,
    value: blockEntity,
    valueName: "blockEntity",
  });
  useSendGraphValue({
    graphService,
    value: blockGraph,
    valueName: "blockGraph",
  });
  useSendGraphValue({
    graphService,
    value: entityTypes,
    valueName: "entityTypes",
  });
  useSendGraphValue({
    graphService,
    value: linkedAggregations,
    valueName: "linkedAggregations",
  });
  useSendGraphValue({
    graphService,
    value: readonly,
    valueName: "readonly",
  });

  useEffect(() => {
    if (graphService) {
      graphService.registerCallbacks(graphServiceCallbacks);
    }
  }, [graphService, graphServiceCallbacks]);

  const Component = (
    <div
      ref={wrapperRef}
      style={
        debugMode
          ? {
              border: "1px dashed rgb(0,0,0,0.1)",
              marginTop: 30,
            }
          : {}
      }
    >
      {graphService ? (
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
      ) : null}
    </div>
  );

  return (
    <MockBlockDockProvider
      blockEntity={blockEntity}
      blockInfo={
        blockInfo ?? {
          blockType: {
            entryPoint: blockType,
          },
        }
      }
      blockSchema={blockSchema}
      datastore={datastore}
      debugMode={debugMode}
      readonly={readonly}
      setReadonly={setReadonly}
      setDebugMode={setDebugMode}
      setEntityIdOfEntityForBlock={setEntityIdOfEntityForBlock}
      updateEntity={graphServiceCallbacks.updateEntity}
    >
      {!debugMode ? (
        <div className="mbd-non-debug-mode-wrapper">
          {Component}
          {!hideDebugToggle && (
            <button
              className="mbd-debug-mode-toggle"
              type="button"
              onClick={() => setDebugMode(true)}
            >
              Preview Mode
              <OffSwitch />
            </button>
          )}
        </div>
      ) : (
        <DebugView>{Component}</DebugView>
      )}
    </MockBlockDockProvider>
  );
};
