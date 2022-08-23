import {
  BlockGraph,
  EmbedderGraphMessageCallbacks,
  Entity,
  EntityType,
  Link,
  LinkedAggregation,
  LinkedAggregationDefinition,
} from "@blockprotocol/graph";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { mockData as initialMockData } from "./data";
import { useLinkFields } from "./use-mock-block-props/use-link-fields";
import {
  MockData,
  useMockDatastore,
} from "./use-mock-block-props/use-mock-datastore";

/**
 * A hook to generate Block Protocol properties and callbacks for use in testing blocks.
 * The starting mock data can be customized using the initial[X] props.
 * See README.md for usage instructions.
 * @param [blockEntity] the block's own starting properties, if any
 * @param [blockSchema] - The schema for the block entity
 * @param [initialEntities] - The entities to include in the data store (NOT the block entity, which is always provided)
 * @param [initialEntityTypes] - The entity types to include in the data store (NOT the block's type, which is always provided)
 * @param [initialLinks] - The links to include in the data store
 * @param [initialLinkedAggregations] - The linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 */
export const useMockBlockProps = ({
  blockEntity,
  blockSchema: initialBlockSchema,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
  readonly,
}: {
  blockEntity?: Entity;
  blockSchema?: Partial<EntityType>;
  initialEntities?: Entity[];
  initialEntityTypes?: EntityType[];
  initialLinks?: Link[];
  initialLinkedAggregations?: LinkedAggregationDefinition[];
  readonly?: boolean;
}): {
  blockEntity: Entity;
  blockGraph: BlockGraph;
  blockSchema?: Partial<EntityType>;
  datastore: MockData;
  entityTypes: EntityType[];
  graphServiceCallbacks: Required<EmbedderGraphMessageCallbacks>;
  linkedAggregations: LinkedAggregation[];
  setBlockSchema?: Dispatch<SetStateAction<Partial<EntityType>>>;
} => {
  // @todo rename this
  const [blockEntity1, setBlockEntity1] = useState(blockEntity);
  const [readonly1, setReadonly1] = useState(readonly);
  const [initialEntities1, setInitialEntities1] = useState(initialEntities);
  const [initialEntityTypes1, setInitialEntityTypes1] =
    useState(initialEntityTypes);
  const [blockSchema, setBlockSchema] =
    useState<Partial<EntityType>>(initialBlockSchema);
  const [initialLinks1, setInitialLinks1] = useState(initialLinks);

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
        newBlockEntity,
        ...(initialEntities ?? initialMockData.entities),
      ],
      entityTypes: [
        blockEntityType,
        ...(initialEntityTypes ?? initialMockData.entityTypes),
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

  const datastore = useMockDatastore(mockData, readonly);

  const {
    entities,
    entityTypes,
    graphServiceCallbacks,
    links,
    linkedAggregationDefinitions,
  } = datastore;

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
    datastore,
    entityTypes,
    linkedAggregations,
    graphServiceCallbacks,
    blockSchema,
    setBlockSchema,
  };
};
