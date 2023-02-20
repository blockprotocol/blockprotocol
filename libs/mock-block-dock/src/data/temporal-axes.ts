import {
  QueryTemporalAxes,
  SubgraphTemporalAxes,
} from "@blockprotocol/graph/temporal";

export const mockDataSubgraphTemporalAxes = (): SubgraphTemporalAxes => {
  const now = new Date().toISOString();

  const temporalAxes: QueryTemporalAxes = {
    pinned: {
      axis: "transactionTime",
      timestamp: now,
    },
    variable: {
      axis: "decisionTime",
      interval: {
        start: { kind: "inclusive", limit: new Date(0).toISOString() },
        end: { kind: "inclusive", limit: now },
      },
    },
  };

  return {
    initial: temporalAxes,
    resolved: temporalAxes,
  };
};
