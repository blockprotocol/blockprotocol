import {
  BlockGraphProperties,
  Entity,
  EntityType,
  GraphEmbedderHandler,
  Link,
  LinkedAggregationDefinition,
} from "@blockprotocol/graph";
import React, {
  Children,
  cloneElement,
  ReactElement,
  useEffect,
  useRef,
  useState,
  VoidFunctionComponent,
} from "react";

import { useMockBlockProps } from "./use-mock-block-props";

type MockBlockDockProps = {
  children: ReactElement;
  blockSchema?: Partial<EntityType>;
  initialEntities?: Entity[];
  initialEntityTypes?: EntityType[];
  initialLinks?: Link[];
  initialLinkedAggregations?: LinkedAggregationDefinition[];
};

/**
 * A component to wrap a Block Protocol block, acting as a mock embedding application.
 * It provides the functions specified in the Block Protocol, and mock data which can be customized via props.
 * See README.md for usage instructions.
 * @param children the block component to be provided mock data and functions, with any starting props
 * @param [blockSchema] - The schema for the block entity
 * @param [initialEntities] - The entities to include in the data store (NOT the block entity, which is always provided)
 * @param [initialEntityTypes] - The entity types to include in the data store (NOT the block's type, which is always provided)
 * @param [initialLinks] - The links to include in the data store
 * @param [initialLinkedAggregations] - The linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 */
export const MockBlockDock: VoidFunctionComponent<MockBlockDockProps> = ({
  children,
  blockSchema,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
}) => {
  const {
    blockEntity,
    blockGraph,
    entityTypes,
    graphServiceCallbacks,
    linkedAggregations,
  } = useMockBlockProps({
    blockEntity: children.props?.graph?.blockEntity,
    blockSchema,
    initialEntities,
    initialEntityTypes,
    initialLinks,
    initialLinkedAggregations,
  });

  const [graphService, setGraphService] = useState<GraphEmbedderHandler | null>(
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
    } else if (graphService) {
      return;
    }
    setGraphService(
      new GraphEmbedderHandler({
        blockGraph,
        blockEntity,
        linkedAggregations,
        callbacks: graphServiceCallbacks,
        element: wrapperRef.current,
      }),
    );
  }, [
    blockEntity,
    blockGraph,
    graphService,
    graphServiceCallbacks,
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

  const child = cloneElement(Children.only(children), propsToInject);

  return <div ref={wrapperRef}>{graphService ? child : null}</div>;
};
