import { HtmlBlockDefinition } from "@blockprotocol/core";
import {
  BlockGraphProperties,
  Entity,
  EntityType,
  GraphEmbedderHandler,
  Link,
  LinkedAggregationDefinition,
} from "@blockprotocol/graph";
import { HookEmbedderHandler } from "@blockprotocol/hook";
import React, {
  ComponentType,
  useEffect,
  useRef,
  useState,
  VoidFunctionComponent,
} from "react";

import { BlockRenderer } from "./block-renderer";
import { JsonView } from "./json-view";
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
export const MockBlockDock: VoidFunctionComponent<MockBlockDockProps> = ({
  blockDefinition,
  blockEntity: initialBlockEntity,
  blockSchema,
  debug,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
}) => {
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
  });

  const [graphService, setGraphService] = useState<GraphEmbedderHandler | null>(
    null,
  );
  const [hookService, setHookService] = useState<HookEmbedderHandler | null>(
    null,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const propsToInject: BlockGraphProperties<any> = {
    graph: {
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
    } else {
      if (!graphService) {
        setGraphService(
          new GraphEmbedderHandler({
            blockGraph,
            blockEntity,
            linkedAggregations,
            callbacks: graphServiceCallbacks,
            element: wrapperRef.current,
          }),
        );
      }
      if (!hookService) {
        setHookService(
          new HookEmbedderHandler({
            element: wrapperRef.current,
            callbacks: {
              node: (msg: { data: { node: HTMLElement; value: unknown } }) => {
                // eslint-disable-next-line no-param-reassign
                msg.data.node.innerHTML = `Set by parent with value ${msg.data.value}`;
              },
              render: async ({ data }: any) => {
                const node = document.createElement("h1");

                node.innerText = `The value passed is "${(
                  data?.value as any
                )?.toString?.()}"`;

                return {
                  data: node,
                };
              },
            },
          }),
        );
      }
    }
  }, [
    blockEntity,
    blockGraph,
    graphService,
    graphServiceCallbacks,
    hookService,
    linkedAggregations,
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

  if (!debug) {
    return (
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
  }

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ marginTop: 0, marginBottom: 3 }}>Block</h3>
        <div style={{ padding: 15, border: "1px dashed black" }}>
          <div ref={wrapperRef}>
            {graphService ? (
              <BlockRenderer
                customElement={
                  "customElement" in blockDefinition
                    ? blockDefinition.customElement
                    : undefined
                }
                html={
                  "html" in blockDefinition ? blockDefinition.html : undefined
                }
                properties={propsToInject}
                ReactComponent={
                  "ReactComponent" in blockDefinition
                    ? blockDefinition.ReactComponent
                    : undefined
                }
              />
            ) : null}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 4 }}>Block Properties</h3>
        <JsonView
          collapseKeys={["graph"]}
          rootName="props"
          src={propsToInject}
        />
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 4 }}>Datastore</h3>
        <JsonView
          collapseKeys={[
            "entities",
            "entityTypes",
            "links",
            "linkedAggregations",
          ]}
          rootName="datastore"
          src={{
            entities: datastore.entities,
            entityTypes: datastore.entityTypes,
            links: datastore.links,
            linkedAggregations: datastore.linkedAggregationDefinitions,
          }}
        />
      </div>
    </div>
  );
};
