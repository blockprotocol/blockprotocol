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
import { useMockDatastore } from "./useMockDatastore";
import { mockData } from "./data";
import { useLinkFields } from "./useLinkFields";

type MockBlockDockProps = {
  children: ReactElement;
  blockSchema?: Partial<BlockProtocolEntityType>;
};

export const MockBlockDock: VoidFunctionComponent<MockBlockDockProps> = ({
  children,
  blockSchema,
}) => {
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

  mockData.entities.push(initialBlockEntity);
  mockData.entityTypes.push(blockEntityType);

  const { entities, entityTypes, links, functions } =
    useMockDatastore(mockData);

  const latestBlockEntity = useMemo(
    () =>
      entities.find((entity) => entity.entityId === children.props.entityId),
    [entities, children.props.entityId],
  );
  if (!latestBlockEntity) {
    throw new Error("Cannot find block entity. Did it delete itself?");
  }

  const { accountId, entityId, entityTypeId } = latestBlockEntity;
  const { updateEntities } = functions;

  const prevChildPropsString = useRef<ReactElement["props"]>(
    JSON.stringify(children.props),
  );
  useEffect(() => {
    if (JSON.stringify(children.props) !== prevChildPropsString.current) {
      updateEntities?.([
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
