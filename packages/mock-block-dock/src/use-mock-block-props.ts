import {
  BlockGraph,
  EmbedderGraphMessageCallbacks,
  Entity,
  EntityType,
  Link,
  LinkedAggregation,
  LinkedAggregationDefinition,
} from "@blockprotocol/graph";
import { Dispatch, SetStateAction, useState } from "react";

import { mockData as initialMockData } from "./data";
import { useLinkFields } from "./use-mock-block-props/use-link-fields";
import {
  MockData,
  useMockDatastore,
} from "./use-mock-block-props/use-mock-datastore";
import { usePrevious } from "./use-previous";

export type MockBlockHookArgs = {
  blockEntity?: Entity;
  blockSchema?: Partial<EntityType>;
  initialEntities?: Entity[];
  initialEntityTypes?: EntityType[];
  initialLinks?: Link[];
  initialLinkedAggregations?: LinkedAggregationDefinition[];
  readonly: boolean;
  debug: boolean;
};

export type MockBlockHookResult = {
  blockEntity: Entity;
  blockGraph: BlockGraph;
  blockSchema?: Partial<EntityType>;
  datastore: MockData;
  entityTypes: EntityType[];
  graphServiceCallbacks: Required<EmbedderGraphMessageCallbacks>;
  linkedAggregations: LinkedAggregation[];
  readonly: boolean;
  debugMode: boolean;
  setBlockSchema: Dispatch<SetStateAction<Partial<EntityType>>>;
  setBlockEntity: Dispatch<SetStateAction<Entity>>;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
};

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
  blockEntity: externalBlockEntity,
  blockSchema: externalBlockSchema,
  initialEntities,
  initialEntityTypes,
  initialLinks,
  initialLinkedAggregations,
  readonly: externalReadonly,
  debug: externalDebug,
}: MockBlockHookArgs): MockBlockHookResult => {
  const [blockSchema, setBlockSchema] = useState<Partial<EntityType>>(
    externalBlockSchema!,
  );
  const [readonly, setReadonly] = useState<boolean>(externalReadonly);
  const [debugMode, setDebugMode] = useState<boolean>(!!externalDebug);

  const prevExternalReadonly = usePrevious(externalReadonly);
  const prevExternalDebug = usePrevious(externalDebug);

  const getDefaultMockData = () => {
    return {
      entities: initialEntities ?? initialMockData.entities,
      entityTypes: initialEntityTypes ?? initialMockData.entityTypes,
      links: initialLinks ?? initialMockData.links,
      linkedAggregationDefinitions:
        initialLinkedAggregations ??
        initialMockData.linkedAggregationDefinitions,
    };
  };

  const datastore = useMockDatastore(
    getDefaultMockData(),
    readonly,
    externalBlockEntity,
    blockSchema,
  );

  const {
    entities,
    entityTypes,
    blockEntity,
    setBlockEntity,
    graphServiceCallbacks,
    links,
    linkedAggregationDefinitions,
  } = datastore;

  // @todo we don't do anything with this type except check it exists - do we need to do this?
  // const latestBlockEntityType = useMemo(
  //   () =>
  //     entityTypes.find(
  //       (entityType) =>
  //         entityType.entityTypeId === latestBlockEntity.entityTypeId,
  //     ),
  //   [entityTypes, latestBlockEntity.entityTypeId],
  // );

  // if (!latestBlockEntityType) {
  //   throw new Error("Cannot find block entity type. Has it been deleted?");
  // }

  // fallback in case the entityId of the wrapped component is updated by updating its props
  // const latestBlockEntity = useMemo(() => {
  //   return entities.find((entity) => entity.entityId === blockEntity.entityId);
  // }, [entities, blockEntity.entityId]);

  if (!blockEntity) {
    throw new Error("Cannot find block entity. Did it delete itself?");
  }

  // construct BP-specified link fields from the links and linkedAggregations in the datastore
  const { blockGraph, linkedAggregations } = useLinkFields({
    entities,
    links,
    linkedAggregationDefinitions,
    startingEntity: blockEntity,
  });

  if (
    externalReadonly !== prevExternalReadonly &&
    readonly !== externalReadonly
  ) {
    setReadonly(externalReadonly);
  }

  if (externalDebug !== prevExternalDebug && debugMode !== externalDebug) {
    setDebugMode(externalDebug);
  }

  console.log({ blockEntity, entityTypes, entities });

  return {
    blockEntity,
    blockGraph,
    datastore,
    entityTypes,
    linkedAggregations,
    graphServiceCallbacks,
    blockSchema,
    readonly,
    setBlockSchema,
    setBlockEntity,
    setReadonly,
    debugMode,
    setDebugMode,
  };
};
