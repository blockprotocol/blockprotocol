import { HtmlBlockDefinition } from "@blockprotocol/core";
import {
  BlockGraphProperties,
  Entity,
  EntityType,
  Link,
  LinkedAggregationDefinition,
} from "@blockprotocol/graph";
import { useGraphEmbedderService } from "@blockprotocol/graph/react";
import {
  ComponentType,
  FunctionComponent,
  lazy,
  Suspense,
  useEffect,
  useRef,
} from "react";

import { BlockRenderer } from "./block-renderer";
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
 * @param props.blockDefinition the source for the block and any additional metadata required
 * @param [props.blockEntity] the starting properties for the block entity
 * @param [props.blockInfo] metadata about the block
 * @param [props.blockSchema] the schema for the block entity
 * @param [props.debug=false] display debugging information
 * @param [props.hideDebugToggle=false] hide the ability to toggle the debug UI
 * @param [props.initialEntities] the entities to include in the data store (NOT the block entity, which is always provided)
 * @param [props.initialEntityTypes] the entity types to include in the data store (NOT the block's type, which is always provided)
 * @param [props.initialLinks] the links to include in the data store
 * @param [props.initialLinkedAggregations] The linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 * @param [props.readonly=false] whether the block should display in readonly mode or not
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

  const { graphService } = useGraphEmbedderService(wrapperRef, {
    blockGraph,
    blockEntity,
    entityTypes,
    linkedAggregations,
    callbacks: graphServiceCallbacks,
    readonly,
  });

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

  const blockRendererWithBorder = (
    <div
      style={{
        border: "1px dashed rgb(0,0,0,0.1)",
        marginTop: 30,
      }}
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
      <div ref={wrapperRef}>
        <Suspense>
          {hideDebugToggle && !debugMode ? (
            blockRendererWithBorder
          ) : (
            <MockBlockDockUi>{blockRendererWithBorder}</MockBlockDockUi>
          )}
        </Suspense>
      </div>
    </MockBlockDockProvider>
  );
};
