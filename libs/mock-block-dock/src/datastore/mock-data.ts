import { Entity, SubgraphTemporalAxes } from "@blockprotocol/graph";

export type MockData = {
  subgraphTemporalAxes: SubgraphTemporalAxes;
  entities: Entity<true>[];
  // linkedAggregationDefinitions: LinkedAggregationDefinition[];
};
