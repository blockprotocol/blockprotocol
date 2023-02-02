import { Subgraph } from "@blockprotocol/graph";
import { buildSubgraph } from "@blockprotocol/graph/stdlib";
import { useMemo } from "react";

import { MockData } from "./mock-data";

export const useMockDataToSubgraph = (mockData: MockData): Subgraph => {
  return useMemo(() => {
    const { entities } = mockData;

    return buildSubgraph({ entities }, [], {
      hasLeftEntity: { incoming: 255, outgoing: 255 },
      hasRightEntity: { incoming: 255, outgoing: 255 },
    });
  }, [mockData]);
};
