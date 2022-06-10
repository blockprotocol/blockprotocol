import {
  BlockProtocolEntity,
  BlockProtocolEntityType,
  BlockProtocolLink,
  BlockProtocolLinkedAggregationDefinition,
} from "blockprotocol";
import {
  Children,
  cloneElement,
  ReactElement,
  VoidFunctionComponent,
} from "react";

import { useMockBlockProps } from "./use-mock-block-props";

type MockBlockDockProps = {
  children: ReactElement;
  blockSchema?: Partial<BlockProtocolEntityType>;
  initialEntities?: BlockProtocolEntity[];
  initialEntityTypes?: BlockProtocolEntityType[];
  initialLinks?: BlockProtocolLink[];
  initialLinkedAggregations?: BlockProtocolLinkedAggregationDefinition[];
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
    blockProperties,
    blockProtocolFunctions,
    entityTypes,
    linkedAggregations,
    linkedEntities,
    linkGroups,
  } = useMockBlockProps({
    blockProperties: children.props,
    blockSchema,
    initialEntities,
    initialEntityTypes,
    initialLinks,
    initialLinkedAggregations,
  });

  const propsToInject = {
    ...blockProperties,
    ...blockProtocolFunctions,
    entityTypes,
    linkedAggregations,
    linkedEntities,
    linkGroups,
  };

  return cloneElement(Children.only(children), propsToInject);
};
