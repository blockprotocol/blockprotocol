import { MockData } from "../datastore/mock-data";
import { createEntities } from "./entities";
import { mockDataSubgraphTemporalAxes } from "./temporal-axes";

export const mockData: MockData = (() => {
  const subgraphTemporalAxes = mockDataSubgraphTemporalAxes();

  return {
    subgraphTemporalAxes,
    entities: createEntities(subgraphTemporalAxes.resolved),
    // linkedAggregationDefinitions,
  };
})();
