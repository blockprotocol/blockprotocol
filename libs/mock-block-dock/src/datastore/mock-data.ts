import { Entity, EntityType } from "@blockprotocol/graph";
import {
  Entity as EntityTemporal,
  SubgraphTemporalAxes,
} from "@blockprotocol/graph/temporal";

export type MockData<Temporal> = {
  entityTypes: EntityType[];
} & {
  entities: Temporal extends true ? EntityTemporal[] : Entity[];
  // linkedQueryDefinitions: LinkedQueryDefinition[];
} & (Temporal extends true
    ? {
        subgraphTemporalAxes: SubgraphTemporalAxes;
      }
    : {});

export const isTemporalMockData = <Temporal>(
  mockData: MockData<Temporal>,
): mockData is MockData<true> => {
  // this cast should be safe because we're only checking if subgraphTemporalAxes is defined
  return (mockData as MockData<true>).subgraphTemporalAxes !== undefined;
};
