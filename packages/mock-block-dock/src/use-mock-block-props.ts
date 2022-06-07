import {
  BlockProtocolEntity,
  BlockProtocolEntityType,
  BlockProtocolFunctions,
  BlockProtocolLink,
  BlockProtocolLinkedAggregationDefinition,
  BlockProtocolProps,
} from "blockprotocol";
import { useEffect, useMemo, useRef } from "react";

import { mockData as initialMockData } from "./data";
import { useLinkFields } from "./use-link-fields";
import { MockData, useMockDatastore } from "./use-mock-datastore";

/**
 * A hook to generate Block Protocol properties to pass to a block for testing.
 * It provides the functions specified in the Block Protocol, and mock data which can be customized via props.
 * See README.md for usage instructions.
 * @param [blockProperties] the block's own starting properties, if any
 * @param [blockSchema] - The schema for the block entity
 * @param [initialEntities] - The entities to include in the data store (NOT the block entity, which is always provided)
 * @param [initialEntityTypes] - The entity types to include in the data store (NOT the block's type, which is always provided)
 * @param [initialLinks] - The links to include in the data store
 * @param [initialLinkedAggregations] - The linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 */
export const useMockBlockProps = ({
  blockProperties,
  blockSchema,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
}: {
  blockProperties: BlockProtocolEntity;
  blockSchema?: Partial<BlockProtocolEntityType>;
  initialEntities?: BlockProtocolEntity[];
  initialEntityTypes?: BlockProtocolEntityType[];
  initialLinks?: BlockProtocolLink[];
  initialLinkedAggregations?: BlockProtocolLinkedAggregationDefinition[];
}): {
  blockProperties: BlockProtocolEntity;
  blockProtocolFunctions: Required<BlockProtocolFunctions>;
  entityTypes: BlockProtocolProps["entityTypes"];
  linkedAggregations: BlockProtocolProps["linkedAggregations"];
  linkedEntities: BlockProtocolProps["linkedEntities"];
  linkGroups: BlockProtocolProps["linkGroups"];
} => {
  const { initialBlockEntity, mockData } = useMemo((): {
    initialBlockEntity: BlockProtocolEntity;
    mockData: MockData;
  } => {
    const blockEntityType: BlockProtocolEntityType = {
      entityTypeId: "blockType1",
      title: "BlockType",
      type: "object",
      $schema: "https://json-schema.org/draft/2019-09/schema",
      $id: "http://localhost/blockType1",
      ...(blockSchema ?? {}),
    };

    const accountId = blockProperties.accountId ?? "accountId";

    const blockEntity: BlockProtocolEntity = {
      accountId,
      entityId: "block1",
    };

    if (blockProperties && Object.keys(blockProperties).length > 0) {
      Object.assign(blockEntity, blockProperties);
    }

    blockEntity.entityTypeId = blockEntityType.entityTypeId;

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

    nextMockData.entities.push(blockEntity);
    nextMockData.entityTypes.push(blockEntityType);

    return { initialBlockEntity: blockEntity, mockData: nextMockData };
  }, [
    blockProperties,
    blockSchema,
    initialEntities,
    initialEntityTypes,
    initialLinks,
    initialLinkedAggregations,
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
      entities.find(
        (entity) => entity.entityId === initialBlockEntity.entityId,
      ) ??
      // fallback in case the entityId of the wrapped component is updated by updating its props
      mockData.entities.find(
        (entity) => entity.entityId === initialBlockEntity.entityId,
      )
    );
  }, [entities, initialBlockEntity.entityId, mockData.entities]);

  if (!latestBlockEntity) {
    throw new Error("Cannot find block entity. Did it delete itself?");
  }

  const { accountId, entityId, entityTypeId } = latestBlockEntity;
  const { updateEntities } = functions;

  // watch for changes to the props provided to the wrapped component, and update the associated entity if they change
  const prevChildPropsString = useRef<string>(JSON.stringify(blockProperties));
  useEffect(() => {
    if (JSON.stringify(blockProperties) !== prevChildPropsString.current) {
      void updateEntities?.([
        {
          accountId,
          entityId,
          entityTypeId,
          data: blockProperties,
        },
      ]);
    }
    prevChildPropsString.current = JSON.stringify(blockProperties);
  }, [accountId, blockProperties, entityId, entityTypeId, updateEntities]);

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

  return {
    blockProperties: latestBlockEntity,
    blockProtocolFunctions: functions,
    entityTypes,
    linkedAggregations,
    linkedEntities,
    linkGroups,
  };
};
