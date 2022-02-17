import {
  Children,
  cloneElement,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
  const getMockData = useCallback(
    (mockData: MockData): MockData => {
      const blockEntityType: BlockProtocolEntityType = {
        entityTypeId: "blockType1",
        title: "BlockType",
        type: "object",
        $schema: "https://json-schema.org/draft/2019-09/schema",
        $id: "http://localhost/blockType1",
        ...(blockSchema ?? {}),
      };

      const initialBlockEntity: BlockProtocolEntity = {
        accountId: "account1",
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

      const nextMockData: MockData = { ...mockData };

      nextMockData.entities = [...mockData.entities, initialBlockEntity];
      nextMockData.entityTypes = [...mockData.entityTypes, blockEntityType];
      nextMockData.blockEntityId = children.props.entityId;

      return nextMockData;
    },
    [blockSchema, children.props],
  );

  const [mockData, setMockData] = useState<MockData>(
    getMockData(initialMockData),
  );

  useEffect(() => {
    setMockData(getMockData(initialMockData));
  }, [children.props.entityId, getMockData]);

  const { entities, entityTypes, links, functions, latestBlockEntity } =
    useMockDatastore(mockData);

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

  const { linkGroups, linkedEntities } = useLinkFields({
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
    entityTypes: [latestBlockEntityType],
    linkGroups,
    linkedEntities,
  };

  return cloneElement(Children.only(children), propsToInject);
};
