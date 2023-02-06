import { Subgraph } from "@blockprotocol/graph";
import { buildSubgraph } from "@blockprotocol/graph/stdlib";
import { useMemo } from "react";

import { MockData } from "./mock-data";

export const useMockDataToSubgraph = (mockData: MockData): Subgraph<true> => {
  return useMemo(() => {
    const { entities, subgraphTemporalAxes } = mockData;

    /** @todo - accept ontology elements within the MBD datastore */
    return buildSubgraph(
      { dataTypes: [], propertyTypes: [], entityTypes: [], entities },
      [],
      {
        hasLeftEntity: { incoming: 255, outgoing: 255 },
        hasRightEntity: { incoming: 255, outgoing: 255 },
      },
      subgraphTemporalAxes,
    );
  }, [mockData]);
};
