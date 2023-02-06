import {
  QueryTemporalAxes,
  QueryTemporalAxesUnresolved,
} from "@blockprotocol/graph";

/**
 * Takes an {@link QueryTemporalAxesUnresolved} and converts it into a {@link QueryTemporalAxes} by replacing any `null`
 * bounds with the current {@link Timestamp}.
 *
 * @param {QueryTemporalAxesUnresolved} initialTemporalAxis
 */
export const resolveTemporalAxes = (
  initialTemporalAxis: QueryTemporalAxesUnresolved,
): QueryTemporalAxes => {
  const currentTimestamp = new Date().toISOString();

  const resolvedTemporalAxes = JSON.parse(
    JSON.stringify(initialTemporalAxis),
  ) as QueryTemporalAxesUnresolved;

  if (resolvedTemporalAxes.pinned.timestamp === null) {
    resolvedTemporalAxes.pinned.timestamp = currentTimestamp;
  }
  if (resolvedTemporalAxes.variable.interval.start === null) {
    resolvedTemporalAxes.variable.interval.start = {
      kind: "inclusive",
      limit: currentTimestamp,
    };
  }
  if (resolvedTemporalAxes.variable.interval.end === null) {
    resolvedTemporalAxes.variable.interval.end = {
      kind: "inclusive",
      limit: currentTimestamp,
    };
  }

  /** @todo - can we ergonomically convince TS of this type and avoid a cast */
  return resolvedTemporalAxes as QueryTemporalAxes;
};
