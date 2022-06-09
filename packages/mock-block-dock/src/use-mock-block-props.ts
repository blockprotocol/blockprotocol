import {
  BlockGraph,
  EmbedderGraphMessageCallbacks,
  Entity,
  EntityType,
  Link,
  LinkedAggregation,
  LinkedAggregationDefinition,
} from "@blockprotocol/graph";
import { useMemo } from "react";

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
  blockEntity,
  blockSchema,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
}: {
  blockEntity: Entity;
  blockSchema?: Partial<EntityType>;
  initialEntities?: Entity[];
  initialEntityTypes?: EntityType[];
  initialLinks?: Link[];
  initialLinkedAggregations?: LinkedAggregationDefinition[];
}): {
  blockEntity: Entity;
  blockGraph: BlockGraph;
  entityTypes: EntityType[];
  graphServiceCallbacks: Required<EmbedderGraphMessageCallbacks>;
  linkedAggregations: LinkedAggregation[];
} => {
  const { initialBlockEntity, mockData } = useMemo((): {
    initialBlockEntity: Entity;
    mockData: MockData;
  } => {
    const entityTypeId = blockEntity?.entityTypeId ?? "block-type-1";

    const blockEntityType: EntityType = {
      entityTypeId,
      schema: {
        title: "BlockType",
        type: "object",
        $schema: "https://json-schema.org/draft/2019-09/schema",
        $id: "http://localhost/blockType1",
        ...(blockSchema ?? {}),
      },
    };

    const newBlockEntity: Entity = {
      entityId: "block1",
      entityTypeId,
      properties: {},
    };

    if (blockEntity && Object.keys(blockEntity).length > 0) {
      Object.assign(newBlockEntity, blockEntity);
    }

    const nextMockData: MockData = {
      entities: [
        ...(initialEntities ?? initialMockData.entities),
        newBlockEntity,
      ],
      entityTypes: [
        ...(initialEntityTypes ?? initialMockData.entityTypes),
        blockEntityType,
      ],
      links: initialLinks ?? initialMockData.links,
      linkedAggregationDefinitions:
        initialLinkedAggregations ??
        initialMockData.linkedAggregationDefinitions,
    };

    return { initialBlockEntity: newBlockEntity, mockData: nextMockData };
  }, [
    blockEntity,
    blockSchema,
    initialEntities,
    initialEntityTypes,
    initialLinks,
    initialLinkedAggregations,
  ]);

  const {
    entities,
    entityTypes,
    graphServiceCallbacks,
    links,
    linkedAggregationDefinitions,
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

  // construct BP-specified link fields from the links and linkedAggregations in the datastore
  const { blockGraph, linkedAggregations } = useLinkFields({
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
    blockEntity: latestBlockEntity,
    blockGraph,
    entityTypes,
    linkedAggregations,
    graphServiceCallbacks,
  };
};
