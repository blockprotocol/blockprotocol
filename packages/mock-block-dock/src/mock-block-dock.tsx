import { HtmlBlockDefinition } from "@blockprotocol/core";
import {
  BlockGraphProperties,
  Entity,
  EntityType,
  GraphEmbedderHandler,
  Link,
  LinkedAggregationDefinition,
} from "@blockprotocol/graph";
import { Box } from "@mui/material";
import {
  ComponentType,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";

import { BlockRenderer } from "./block-renderer";
import { DebugLayout } from "./debug-layout";
import { DevTools } from "./dev-tools";
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
 * @para
 */
export const MockBlockDock: FunctionComponent<MockBlockDockProps> = ({
  blockDefinition,
  blockEntity: initialBlockEntity1,
  blockSchema: initialBlockSchema,
  debug,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
  readonly: initialReadonly,
}) => {
  const [initialBlockEntity, setInitialBlockEntity] =
    useState(initialBlockEntity1);
  const [blockSchema, setBlockSchema] = useState(initialBlockSchema);
  const [debugValues, setDebugValues] = useState({});

  const {
    blockEntity,
    blockGraph,
    datastore,
    entityTypes,
    graphServiceCallbacks,
    linkedAggregations,
  } = useMockBlockProps({
    blockEntity: initialBlockEntity,
    blockSchema,
    initialEntities,
    initialEntityTypes,
    initialLinks,
    initialLinkedAggregations,
    readonly: initialReadonly,
  });

  const [graphService, setGraphService] = useState<GraphEmbedderHandler | null>(
    null,
  );
  const [readonly, setReadonly] = useState<boolean>(!!initialReadonly);
  const [debugMode, setDebugMode] = useState(!!debug);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevReadonly = useRef<boolean | undefined>(initialReadonly);

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
    prevReadonly.current = initialReadonly;
  }, [initialReadonly]);

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
    >
      {!debugMode ? (
        <>
          {Component}
          <div style={{ position: "fixed", bottom: 16, right: 16 }}>
            <button type="button" onClick={() => setDebugMode(true)}>
              Toggle Debug Mode
            </button>
          </div>
        </>
      ) : (
        <DebugLayout blockType={blockType}>
          <Box>
            <Box padding={3.75}>{Component}</Box>
          </Box>
          <DevTools
            graphProperties={propsToInject}
            datastore={datastore}
            readonly={readonly}
            setReadonly={setReadonly}
            setBlockEntity={setInitialBlockEntity}
          />
        </DebugLayout>
      )}
    </MockBlockDockProvider>
  );
};
