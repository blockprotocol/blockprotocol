import {
  Entity as EntityNonTemporal,
  EntityRecordId as EntityRecordIdNonTemporal,
} from "@blockprotocol/graph";
import {
  Entity as EntityTemporal,
  EntityRecordId as EntityRecordIdTemporal,
  QueryTemporalAxes,
} from "@blockprotocol/graph/temporal";
import { Dispatch, SetStateAction, useMemo } from "react";

import { mockData as initialMockData } from "./data";
import { mockDataSubgraphTemporalAxes } from "./data/temporal-axes";
import { MockData } from "./datastore/mock-data";
import {
  MockDatastoreNonTemporal,
  MockDatastoreTemporal,
  useMockDatastoreNonTemporal,
  useMockDatastoreTemporal,
} from "./datastore/use-mock-datastore";
import { useDefaultState } from "./use-default-state";

export type InitialData<Temporal extends boolean> = Temporal extends true
  ? {
      initialTemporalAxes: QueryTemporalAxes;
      initialEntities: EntityTemporal[];
      // initialLinkedAggregations: LinkedAggregationDefinition[];
    }
  : {
      initialEntities: EntityNonTemporal[];
    };

export type MockBlockHookArgs<Temporal extends boolean> = {
  blockEntityRecordId?: Temporal extends true
    ? EntityRecordIdTemporal
    : EntityRecordIdNonTemporal;
  initialData?: InitialData<Temporal>;
  readonly: boolean;
};

export type MockBlockHookResult<Temporal extends boolean> = {
  blockEntityRecordId: Temporal extends true
    ? EntityRecordIdTemporal
    : EntityRecordIdNonTemporal;
  mockDatastore: Temporal extends true
    ? MockDatastoreTemporal
    : MockDatastoreNonTemporal;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  setEntityRecordIdOfEntityForBlock: Dispatch<
    SetStateAction<
      Temporal extends true ? EntityRecordIdTemporal : EntityRecordIdNonTemporal
    >
  >;
};

/**
 * A hook to generate Block Protocol properties and callbacks for use in testing blocks.
 * The starting mock data can be customized using the initial[X] props.
 * See README.md for usage instructions.
 *
 * @param args
 * @param [args.blockEntityRecordId] - the `EntityRecordId` of the block's own starting entity, if any
 * @param [args.initialData] - The initial data to include in the data store, with default mock data being provided if this is omitted
 * @param [args.initialData.initialEntities] - The entities to include in the data store (NOT the block entity, which is always provided)
 * @param [args.initialData.initialTemporalAxes] - The temporal axes that were used in creating the initial entities
 * @param [args.initialData.initialLinkedAggregations] - The linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 */
export const useMockBlockPropsNonTemporal = (
  args: MockBlockHookArgs<false>,
): MockBlockHookResult<false> => {
  const [entityRecordIdOfEntityForBlock, setEntityRecordIdOfEntityForBlock] =
    useDefaultState<EntityRecordIdNonTemporal>(
      args.blockEntityRecordId ?? {
        entityId: "",
        editionId: new Date().toISOString(),
      },
    );

  const [readonly, setReadonly] = useDefaultState<boolean>(args.readonly);

  const { mockData } = useMemo((): {
    mockData: MockData<false>;
  } => {
    const nextMockData = args.initialData
      ? {
          entities: [...args.initialData.initialEntities],
          // linkedAggregationDefinitions:
          //   initialLinkedAggregations
        }
      : initialMockData<false>(undefined);

    if (nextMockData.entities.length === 0) {
      throw new Error(
        `Mock data didn't contain any entities, it has to at least contain the block entity`,
      );
    }

    let blockEntity;
    const { blockEntityRecordId } = args;
    if (blockEntityRecordId) {
      blockEntity = nextMockData.entities.find(
        (entity) =>
          entity.metadata.recordId.entityId === blockEntityRecordId.entityId &&
          entity.metadata.recordId.editionId === blockEntityRecordId.editionId,
      );

      if (blockEntity === undefined) {
        throw new Error(
          `Mock data didn't contain the given block entity revision ID: ${JSON.stringify(
            args.blockEntityRecordId,
          )}`,
        );
      }
    } else {
      blockEntity = nextMockData.entities[0]!;
      setEntityRecordIdOfEntityForBlock(blockEntity.metadata.recordId);
    }

    return { mockData: nextMockData };
  }, [
    args,
    setEntityRecordIdOfEntityForBlock,
    // initialLinkedAggregations,
  ]);

  const mockDatastore = useMockDatastoreNonTemporal(mockData, readonly);

  return {
    blockEntityRecordId: entityRecordIdOfEntityForBlock,
    mockDatastore,
    // linkedAggregations,
    readonly,
    setEntityRecordIdOfEntityForBlock,
    setReadonly,
  };
};

/**
 * A hook to generate Block Protocol properties and callbacks for use in testing blocks.
 * The starting mock data can be customized using the initial[X] props.
 * See README.md for usage instructions.
 *
 * @param args
 * @param [args.blockEntityRecordId] - the `EntityRecordId` of the block's own starting entity, if any
 * @param [args.initialData] - The initial data to include in the data store, with default mock data being provided if this is omitted
 * @param [args.initialData.initialEntities] - The entities to include in the data store (NOT the block entity, which is always provided)
 * @param [args.initialData.initialTemporalAxes] - The temporal axes that were used in creating the initial entities
 * @param [args.initialData.initialLinkedAggregations] - The linkedAggregation DEFINITIONS to include in the data store (results will be resolved automatically)
 */
export const useMockBlockPropsTemporal = (
  args: MockBlockHookArgs<true>,
): MockBlockHookResult<true> => {
  const [entityRecordIdOfEntityForBlock, setEntityRecordIdOfEntityForBlock] =
    useDefaultState<EntityRecordIdTemporal>(
      args.blockEntityRecordId ?? {
        entityId: "",
        editionId: new Date().toISOString(),
      },
    );

  const [readonly, setReadonly] = useDefaultState<boolean>(args.readonly);

  const { mockData } = useMemo((): {
    mockData: MockData<true>;
  } => {
    const nextMockData = args.initialData
      ? {
          entities: [...args.initialData.initialEntities],
          // linkedAggregationDefinitions:
          //   initialLinkedAggregations
          subgraphTemporalAxes: {
            initial: args.initialData.initialTemporalAxes,
            resolved: args.initialData.initialTemporalAxes,
          },
        }
      : initialMockData<true>(mockDataSubgraphTemporalAxes());

    if (nextMockData.entities.length === 0) {
      throw new Error(
        `Mock data didn't contain any entities, it has to at least contain the block entity`,
      );
    }

    let blockEntity;
    const { blockEntityRecordId } = args;
    if (blockEntityRecordId) {
      blockEntity = nextMockData.entities.find(
        (entity) =>
          entity.metadata.recordId.entityId === blockEntityRecordId.entityId &&
          entity.metadata.recordId.editionId === blockEntityRecordId.editionId,
      );

      if (blockEntity === undefined) {
        throw new Error(
          `Mock data didn't contain the given block entity revision ID: ${JSON.stringify(
            args.blockEntityRecordId,
          )}`,
        );
      }
    } else {
      blockEntity = nextMockData.entities[0]!;
      setEntityRecordIdOfEntityForBlock(blockEntity.metadata.recordId);
    }

    return { mockData: nextMockData };
  }, [
    args,
    setEntityRecordIdOfEntityForBlock,
    // initialLinkedAggregations,
  ]);

  const mockDatastore = useMockDatastoreTemporal(mockData, readonly);

  return {
    blockEntityRecordId: entityRecordIdOfEntityForBlock,
    mockDatastore,
    // linkedAggregations,
    readonly,
    setEntityRecordIdOfEntityForBlock,
    setReadonly,
  };
};
