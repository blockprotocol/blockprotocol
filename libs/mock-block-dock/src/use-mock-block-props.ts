import {
  Entity,
  EntityRecordId,
  QueryTemporalAxes,
} from "@blockprotocol/graph";
import { Dispatch, SetStateAction, useMemo } from "react";

import { mockData as initialMockData } from "./data";
import { MockData } from "./datastore/mock-data";
import {
  MockDatastore,
  useMockDatastore,
} from "./datastore/use-mock-datastore";
import { useDefaultState } from "./use-default-state";

export type MockBlockHookArgs = {
  blockEntityRecordId?: EntityRecordId;
  initialData?: {
    initialTemporalAxes: QueryTemporalAxes;
    initialEntities: Entity<true>[];
    // initialLinkedAggregations: LinkedAggregationDefinition[];
  };
  readonly: boolean;
};

export type MockBlockHookResult = {
  blockEntityRecordId: EntityRecordId;
  mockDatastore: MockDatastore;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  setEntityRecordIdOfEntityForBlock: Dispatch<SetStateAction<EntityRecordId>>;
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
export const useMockBlockProps = ({
  blockEntityRecordId: externalBlockEntityRecordId,
  initialData,
  readonly: externalReadonly,
}: MockBlockHookArgs): MockBlockHookResult => {
  const [entityRecordIdOfEntityForBlock, setEntityRecordIdOfEntityForBlock] =
    useDefaultState<EntityRecordId>(
      externalBlockEntityRecordId ?? {
        entityId: "",
        editionId: new Date().toISOString(),
      },
    );

  const [readonly, setReadonly] = useDefaultState<boolean>(externalReadonly);

  const { mockData } = useMemo((): {
    mockData: MockData;
  } => {
    const nextMockData: MockData = initialData
      ? {
          subgraphTemporalAxes: {
            resolved: initialData.initialTemporalAxes,
            initial: initialData.initialTemporalAxes,
          },
          entities: [...initialData.initialEntities],
          // linkedAggregationDefinitions:
          //   initialLinkedAggregations
        }
      : {
          subgraphTemporalAxes: initialMockData.subgraphTemporalAxes,
          entities: initialMockData.entities,
          // linkedAggregationDefinitions:
          //   initialMockData.linkedAggregationDefinitions,
        };

    if (nextMockData.entities.length === 0) {
      throw new Error(
        `Mock data didn't contain any entities, it has to at least contain the block entity`,
      );
    }

    let blockEntity;
    if (externalBlockEntityRecordId) {
      blockEntity = nextMockData.entities.find(
        (entity) =>
          entity.metadata.recordId.entityId ===
            externalBlockEntityRecordId.entityId &&
          entity.metadata.recordId.editionId ===
            externalBlockEntityRecordId.editionId,
      );

      if (blockEntity === undefined) {
        throw new Error(
          `Mock data didn't contain the given block entity revision ID: ${JSON.stringify(
            externalBlockEntityRecordId,
          )}`,
        );
      }
    } else {
      blockEntity = nextMockData.entities[0]!;
      setEntityRecordIdOfEntityForBlock(blockEntity.metadata.recordId);
    }

    return { mockData: nextMockData };
  }, [
    externalBlockEntityRecordId,
    initialData,
    setEntityRecordIdOfEntityForBlock,
    // initialLinkedAggregations,
  ]);

  const mockDatastore = useMockDatastore(mockData, readonly);

  return {
    blockEntityRecordId: entityRecordIdOfEntityForBlock,
    mockDatastore,
    // linkedAggregations,
    readonly,
    setEntityRecordIdOfEntityForBlock,
    setReadonly,
  };
};
