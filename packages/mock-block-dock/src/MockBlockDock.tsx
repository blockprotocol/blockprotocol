import {
  Children,
  cloneElement,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  VoidFunctionComponent,
} from "react";
import {
  BlockProtocolEntity,
  BlockProtocolEntityType,
  BlockProtocolLink,
  BlockProtocolLinkedAggregationDefinition,
} from "blockprotocol";
import { MockData, useMockDatastore } from "./useMockDatastore";
import { mockData as initialMockData } from "./data";
import { useLinkFields } from "./useLinkFields";

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
 * @param [blockSchema] the schema for the block entity
 * @param [initialEntities] the entities to include in the data store (NOT the block entity, which is always provided)
 * @param [initialEntityTypes] the entity types to include in the data store (NOT the block's type, which is always provided)
 * @param [initialLinks] the links to include in the data store
 * @param [initialLinkedAggregations] the linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 */
export const MockBlockDock: VoidFunctionComponent<MockBlockDockProps> = ({
  children,
  blockSchema,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
}) => {
  const mockData = useMemo((): MockData => {
    const blockEntityType: BlockProtocolEntityType = {
      entityTypeId: "blockType1",
      title: "BlockType",
      type: "object",
      $schema: "https://json-schema.org/draft/2019-09/schema",
      $id: "http://localhost/blockType1",
      ...(blockSchema ?? {}),
    };

    const accountId = children.props.accountId ?? "accountId";

    const initialBlockEntity: BlockProtocolEntity = {
      accountId,
      entityId: "block1",
    };

    if (
      children.props &&
      typeof children.props === "object" &&
      Object.keys(children.props).length > 0
    ) {
      Object.assign(initialBlockEntity, children.props);
    }

    initialBlockEntity.entityTypeId = blockEntityType.entityTypeId;

    const nextMockData: MockData = {
      entities:
        initialEntities ??
        // give the entities/types the same accountId as the root entity if user not supplying their own mocks
        initialMockData.entities.map((entity) => ({
          ...entity,
          accountId,
        })),
      entityTypes:
        initialEntityTypes ??
        initialMockData.entityTypes.map((entityType) => ({
          ...entityType,
          accountId,
        })),
      links: initialLinks ?? initialMockData.links,
      linkedAggregationDefinitions:
        initialLinkedAggregations ??
        initialMockData.linkedAggregationDefinitions,
    };

    nextMockData.entities.push(initialBlockEntity);
    nextMockData.entityTypes.push(blockEntityType);

    return nextMockData;
  }, [
    blockSchema,
    initialEntities,
    initialEntityTypes,
    initialLinks,
    initialLinkedAggregations,
    children.props,
  ]);

  const {
    entities,
    entityTypes,
    links,
    linkedAggregationDefinitions,
    functions,
  } = useMockDatastore(mockData);

  const latestBlockEntity = useMemo(() => {
    return (
      entities.find((entity) => entity.entityId === children.props.entityId) ??
      // fallback in case the entityId of the wrapped component is updated by updating its props
      mockData.entities.find(
        (entity) => entity.entityId === children.props.entityId,
      )
    );
  }, [entities, children.props.entityId, mockData.entities]);

  if (!latestBlockEntity) {
    throw new Error("Cannot find block entity. Did it delete itself?");
  }

  const { accountId, entityId, entityTypeId } = latestBlockEntity;
  const { updateEntities } = functions;

  // watch for changes to the props provided to the wrapped component, and update the associated entity if they change
  const prevChildPropsString = useRef<string>(JSON.stringify(children.props));
  useEffect(() => {
    if (JSON.stringify(children.props) !== prevChildPropsString.current) {
      void updateEntities?.([
        {
          accountId,
          entityId,
          entityTypeId,
          ...children.props,
        },
      ]);
    }
    prevChildPropsString.current = JSON.stringify(children.props);
  }, [accountId, entityId, entityTypeId, children.props, updateEntities]);

  // construct BP-specified link fields from the links and linkedAggregations in the datastore
  const { linkedAggregations, linkedEntities, linkGroups } = useLinkFields({
    entities,
    links,
    linkedAggregationDefinitions,
    startingEntity: latestBlockEntity,
  });

  // @todo we don't do anything with this type except check it exists - do we need to do this?
  const latestBlockEntityType = useMemo(
    () =>
      entityTypes.find(
        (entityType) =>
          entityType.entityTypeId === latestBlockEntity.entityTypeId,
      ),
    [entityTypes, latestBlockEntity.entityTypeId],
  );
  if (!latestBlockEntityType) {
    throw new Error("Cannot find block entity type. Has it been deleted?");
  }

  const propsToInject = {
    ...latestBlockEntity,
    ...functions,
    entityTypes,
    linkedAggregations,
    linkedEntities,
    linkGroups,
  };

  return cloneElement(Children.only(children), propsToInject);
};
