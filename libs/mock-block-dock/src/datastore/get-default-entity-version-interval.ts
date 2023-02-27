import { EntityTemporalVersioningMetadata } from "@blockprotocol/graph/temporal";

export const getDefaultEntityVersionInterval =
  (): EntityTemporalVersioningMetadata => {
    const interval = {
      start: {
        kind: "inclusive",
        limit: new Date(0).toISOString(),
      },
      end: {
        kind: "unbounded",
      },
    } as const;

    return {
      transactionTime: interval,
      decisionTime: interval,
    };
  };
