import { QueryTemporalAxesUnresolved } from "@blockprotocol/graph";

/**
 * Creates an {@link QueryTemporalAxesUnresolved} that pins `transactionTime` to `null` and decision time to `null`,
 * which, _at point of query_, will resolve to the current timestamp.
 *
 * This is mostly useful for encoding "latest" behavior, especially when dealing with a block that doesn't require
 * temporal versioning and expects "latest" behavior by default.
 */
export const getDefaultTemporalAxes = (): QueryTemporalAxesUnresolved => {
  return {
    pinned: {
      axis: "transactionTime",
      timestamp: null,
    },
    variable: {
      axis: "decisionTime",
      interval: {
        start: null,
        end: null,
      },
    },
  };
};
