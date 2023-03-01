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
      // initialLinkedQueries: LinkedQueryDefinition[];
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

const defaultMockData = initialMockData<false>(undefined);

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
 * @param [args.initialData.initialLinkedQueries] - The linkedQuery DEFINITIONS to include in the data store (results will be resolved automatically)
 */
export const useMockBlockPropsNonTemporal = (
  args: MockBlockHookArgs<false>,
): MockBlockHookResult<false> => {
  const mockData = useMemo(() => {
    if (
      args.blockEntityRecordId &&
      !args.initialData?.initialEntities.find(
        (entity) =>
          entity.metadata.recordId.entityId ===
            args.blockEntityRecordId!.entityId &&
          entity.metadata.recordId.editionId ===
            args.blockEntityRecordId!.editionId,
      )
    ) {
      throw new Error(
        "If you provide blockEntityRecordId, it must match the recordId of an entity in initialData.initialEntities",
      );
    }

    return {
      entities: [
        ...(args.initialData?.initialEntities ?? []),
        ...defaultMockData.entities,
      ],
    };
  }, [args.blockEntityRecordId, args.initialData?.initialEntities]);

  const defaultBlockEntity = mockData.entities[0]!;

  const [entityRecordIdOfEntityForBlock, setEntityRecordIdOfEntityForBlock] =
    useDefaultState<EntityRecordIdNonTemporal>(
      args.blockEntityRecordId ?? defaultBlockEntity.metadata.recordId,
    );

  const [readonly, setReadonly] = useDefaultState<boolean>(args.readonly);

  const mockDatastore = useMockDatastoreNonTemporal(mockData, readonly);

  return {
    blockEntityRecordId: entityRecordIdOfEntityForBlock,
    mockDatastore,
    // linkedQueries,
    readonly,
    setEntityRecordIdOfEntityForBlock,
    setReadonly,
  };
};

const defaultTemporalMockData = initialMockData<true>(
  mockDataSubgraphTemporalAxes(),
);

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
 * @param [args.initialData.initialLinkedQueries] - The linkedQuery DEFINITIONS to include in the data store (results will be resolved automatically)
 */
export const useMockBlockPropsTemporal = (
  args: MockBlockHookArgs<true>,
): MockBlockHookResult<true> => {
  const mockData = useMemo((): MockData<true> => {
    if (
      args.blockEntityRecordId &&
      !args.initialData?.initialEntities.find(
        (entity) =>
          entity.metadata.recordId.entityId ===
            args.blockEntityRecordId!.entityId &&
          entity.metadata.recordId.editionId ===
            args.blockEntityRecordId!.editionId,
      )
    ) {
      throw new Error(
        "If you provide blockEntityRecordId, it must match the recordId of an entity in initialData.initialEntities",
      );
    }

    return {
      entities: [
        ...(args.initialData?.initialEntities ?? []),
        ...defaultTemporalMockData.entities,
      ],
      subgraphTemporalAxes: args.initialData?.initialTemporalAxes
        ? {
            initial: args.initialData?.initialTemporalAxes,
            resolved: args.initialData?.initialTemporalAxes,
          }
        : defaultTemporalMockData.subgraphTemporalAxes,
    };
  }, [
    args.blockEntityRecordId,
    args.initialData?.initialEntities,
    args.initialData?.initialTemporalAxes,
  ]);

  const defaultBlockEntity = mockData.entities[0]!;

  const [entityRecordIdOfEntityForBlock, setEntityRecordIdOfEntityForBlock] =
    useDefaultState<EntityRecordIdNonTemporal>(
      args.blockEntityRecordId ?? defaultBlockEntity.metadata.recordId,
    );

  const [readonly, setReadonly] = useDefaultState<boolean>(args.readonly);

  const mockDatastore = useMockDatastoreTemporal(mockData, readonly);

  return {
    blockEntityRecordId: entityRecordIdOfEntityForBlock,
    mockDatastore,
    // linkedQueries,
    readonly,
    setEntityRecordIdOfEntityForBlock,
    setReadonly,
  };
};
