import { SubgraphTemporalAxes } from "@blockprotocol/graph/temporal";

import { MockData } from "../datastore/mock-data";
import { createEntities } from "./entities";

export const mockData = <Temporal extends boolean>(
  subgraphTemporalAxes: Temporal extends true
    ? SubgraphTemporalAxes
    : undefined,
): MockData<Temporal> => {
  return {
    ...(subgraphTemporalAxes ? { subgraphTemporalAxes } : {}),
    entities: createEntities(subgraphTemporalAxes?.resolved),
    // linkedQueryDefinitions,
  } as MockData<Temporal>;
};
