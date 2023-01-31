import {
  NonNullTimeInterval,
  TemporalBound,
} from "../types/temporal-versioning.js";

export const compareBounds = (
  lhs: TemporalBound,
  rhs: TemporalBound,
  lhsType: keyof NonNullTimeInterval,
  rhsType: keyof NonNullTimeInterval,
): number => {
  // If the bound values are not equal, then the bound with the lower value is less than the bound with the higher
  // value.
  if (lhs.kind !== "unbounded" && rhs.kind !== "unbounded") {
    if (lhs.limit !== rhs.limit) {
      return lhs.limit.localeCompare(rhs.limit);
    }
  }

  if (lhs.kind === rhs.kind && lhsType === rhsType) {
    return 0;
  }

  if (
    (lhs.kind === "unbounded" && lhsType === "start") ||
    (rhs.kind === "unbounded" && rhsType === "end") ||
    (lhs.kind === "exclusive" &&
      rhs.kind === "exclusive" &&
      lhsType === "end" &&
      rhsType === "start") ||
    (lhs.kind === "exclusive" &&
      rhs.kind === "inclusive" &&
      lhsType === "end") ||
    (lhs.kind === "inclusive" &&
      rhs.kind === "exclusive" &&
      rhsType === "start")
  ) {
    return -1;
  }

  if (
    (lhs.kind === "unbounded" && lhsType === "end") ||
    (rhs.kind === "unbounded" && rhsType === "start") ||
    (lhs.kind === "exclusive" &&
      rhs.kind === "exclusive" &&
      lhsType === "start" &&
      rhsType === "end") ||
    (lhs.kind === "exclusive" &&
      rhs.kind === "inclusive" &&
      lhsType === "start") ||
    (lhs.kind === "inclusive" && rhs.kind === "exclusive" && rhsType === "end")
  ) {
    return 1;
  }
  throw new Error(
    `Implementation error, failed to compare bounds.\nLHS: ${JSON.stringify(
      lhs,
    )}\nRHS: ${JSON.stringify(rhs)}`,
  );
};

/**
 * Checks whether two given temporal bounds are adjacent to one another, where adjacency is defined as being next to one
 * another on the timeline, without any points between, *and where they are not overlapping*.
 *
 * As such, two inclusive (or two exclusive) bounds with the same limit are *not* adjacent.
 *
 * @param lhs - The first bound of the comparison (order is unimportant)
 * @param rhs - The second bound of the comparison
 */
export const boundIsAdjacentTo = (
  lhs: TemporalBound,
  rhs: TemporalBound,
): boolean => {
  if (
    (lhs.kind === "inclusive" && rhs.kind === "exclusive") ||
    (lhs.kind === "exclusive" && rhs.kind === "inclusive")
  ) {
    return lhs.limit === rhs.limit;
  } else {
    return false;
  }
};
