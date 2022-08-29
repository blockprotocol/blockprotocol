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
import { useMockBlockProps } from "./use-mock-block-props";

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
  initialEntities?: Entity[];
  initialEntityTypes?: EntityType[];
  initialLinks?: Link[];
  initialLinkedAggregations?: LinkedAggregationDefinition[];
  readonly?: boolean;
  blockName?: string;
};

/**
 * A component which acts as a mock embedding application for Block Protocol blocks.
 * It provides the functionality specified in the Block Protocol, and mock data which can be customized via props.
 * See README.md for usage instructions.
 * @param [blockDefinition] the source for the block and any additional metadata required
 * @param [blockEntity] the starting properties for the block entity
 * @param [blockSchema] the schema for the block entity
 * @param [debug=false] display debugging information
 * @param [initialEntities] the entities to include in the data store (NOT the block entity, which is always provided)
 * @param [initialEntityTypes] the entity types to include in the data store (NOT the block's type, which is always provided)
 * @param [initialLinks] the links to include in the data store
 * @param [initialLinkedAggregations] - The linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 * @param [readonly=false]
 * @param [blockName] - block's display name
 */
export const MockBlockDock: FunctionComponent<MockBlockDockProps> = ({
  blockDefinition,
  blockEntity: initialBlockEntity,
  blockSchema: initialBlockSchema,
  debug: initialDebug,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
  readonly: initialReadonly,
  blockName,
}) => {
  const {
    blockEntity,
    blockGraph,
    blockSchema,
    datastore,
    debugMode,
    entityTypes,
    graphServiceCallbacks,
    linkedAggregations,
    readonly,
    setBlockSchema,
    setBlockEntity,
    setDebugMode,
    setReadonly,
  } = useMockBlockProps({
    blockEntity: initialBlockEntity,
    blockSchema: initialBlockSchema,
    initialEntities,
    initialEntityTypes,
    initialLinks,
    initialLinkedAggregations,
    readonly: !!initialReadonly,
    debug: !!initialDebug,
  });

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
    graphService,
    graphServiceCallbacks,
    linkedAggregations,
    readonly,
  ]);

  useEffect(() => {
    if (graphService) {
      graphService.blockEntity({ data: blockEntity });
    }
  }, [blockEntity, graphService]);

  useEffect(() => {
    if (graphService) {
      graphService.blockGraph({ data: blockGraph });
    }
  }, [blockGraph, graphService]);

  useEffect(() => {
    if (graphService) {
      graphService.entityTypes({ data: entityTypes });
    }
  }, [entityTypes, graphService]);

  useEffect(() => {
    if (graphService) {
      graphService.linkedAggregations({ data: linkedAggregations });
    }
  }, [linkedAggregations, graphService]);

  useEffect(() => {
    if (graphService) {
      graphService.readonly({ data: readonly });
    }
  }, [readonly, graphService]);

  const Component = (
    <div ref={wrapperRef}>
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
      debugMode={debugMode}
      setDebugMode={setDebugMode}
      readonly={readonly}
      setReadonly={setReadonly}
      blockSchema={blockSchema}
      setBlockSchema={setBlockSchema}
      blockEntity={blockEntity}
      setBlockEntity={setBlockEntity}
      datastore={datastore}
      blockType={blockType}
      blockName={blockName}
    >
      {!debugMode ? (
        <div className="mbd-non-debug-mode-wrapper">
          {Component}
          <button
            className="mbd-debug-mode-toggle"
            type="button"
            onClick={() => setDebugMode(true)}
          >
            Preview Mode
            <OffSwitch />
          </button>
        </div>
      ) : (
        <DebugView>{Component}</DebugView>
      )}
    </MockBlockDockProvider>
  );
};
