import {
  Children,
  cloneElement,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  VoidFunctionComponent,
} from "react";
import { BlockProtocolEntity, BlockProtocolEntityType } from "blockprotocol";
import { MockData, useMockDatastore } from "./useMockDatastore";
import { mockData as initialMockData } from "./data";
import { useLinkFields } from "./useLinkFields";

type MockBlockDockProps = {
  children: ReactElement;
  blockSchema?: Partial<BlockProtocolEntityType>;
};

export const MockBlockDock: VoidFunctionComponent<MockBlockDockProps> = ({
  children,
  blockSchema,
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

    const nextMockData: MockData = { ...initialMockData };

    // give the entities/types the same accountId as the root entity
    nextMockData.entities = [
      ...initialMockData.entities.map((entity) => ({
        ...entity,
        accountId,
      })),
      initialBlockEntity,
    ];
    nextMockData.entityTypes = [
      ...initialMockData.entityTypes.map((entityType) => ({
        ...entityType,
        accountId,
      })),
      blockEntityType,
    ];

    return nextMockData;
  }, [blockSchema, children.props]);

  const { entities, entityTypes, links, functions } =
    useMockDatastore(mockData);

  const latestBlockEntity = useMemo(() => {
    return (
      entities.find((entity) => entity.entityId === children.props.entityId) ??
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

  const { linkedAggregations, linkedEntities, linkGroups } = useLinkFields({
    entities,
    links,
    startingEntity: latestBlockEntity,
  });

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
