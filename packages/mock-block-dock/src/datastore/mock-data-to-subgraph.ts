import { Subgraph } from "@blockprotocol/graph";

import { addEntitiesToSubgraph } from "./mutate-subgraph";
import { MockData } from "./use-mock-datastore";

export const mockDataToSubgraph = (mockData: MockData) => {
  const { entities } = mockData;

  const subgraph: Subgraph = {
    roots: [],
    vertices: {},
    edges: {},
    depths: {
      hasLeftEntity: { incoming: 255, outgoing: 255 },
      hasRightEntity: { incoming: 255, outgoing: 255 },
    },
  };

  addEntitiesToSubgraph(subgraph, entities);

  return subgraph;
};
