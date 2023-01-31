import {
  NonNullTimeInterval,
  TemporalBound,
  Timestamp,
  TimestampLimitedTemporalBound,
} from "../types/temporal-versioning.js";
import { boundIsAdjacentTo, compareBounds } from "./bound.js";

/**
 * Checks whether two given {@link NonNullTimeInterval}s are adjacent to one another, where adjacency is defined as
 * being next to one another on the timeline, without any points between, *and where they are not overlapping*. Thus,
 * if adjacent, the two intervals should span another given interval.
 *
 * @param lhs - The first interval of the comparison (order is unimportant)
 * @param rhs - The second interval of the comparison
 */
export const intervalIsAdjacentToInterval = (
  lhs: NonNullTimeInterval,
  rhs: NonNullTimeInterval,
): boolean => {
  /*
   Examples           |     1     |     2     |     3     |     4     |     5
   ===================|===========|===========|===========|===========|===========
   Interval A         | [---]     | [---)     | [---]     | [---)     | [-]
   Interval B         |     (---] |     [---] |     [---] |     (---] |      [--]
   -------------------|-----------|-----------|-----------|-----------|-----------
   Contains Interval  |   true    |   true    |   false   |   false   |   false
   */
  return (
    boundIsAdjacentTo(lhs.end, rhs.start) ||
    boundIsAdjacentTo(lhs.start, rhs.end)
  );
};

/**
 * Returns whether or not the `rhs` {@link NonNullTimeInterval} is *completely contained* within the `lhs`
 * {@link NonNullTimeInterval}.
 *
 * @param {NonNullTimeInterval} lhs - Checked if it contains the other
 * @param {NonNullTimeInterval} rhs - Checked if it's contained _within_ the other
 */
export const intervalContainsInterval = (
  lhs: NonNullTimeInterval,
  rhs: NonNullTimeInterval,
): boolean => {
  /*
   Examples           |     1     |     2     |     3     |     4     |     5     |     6
   ===================|===========|===========|===========|===========|===========|===========
   Interval A         |  [------] |   [----]  |   [----]  |   (----]  |   (----]  | [--]
   Interval B         |    [--]   |   [---]   |   (---]   |   (---]   |   [---]   |   [---]
   -------------------|-----------|-----------|-----------|-----------|-----------|-----------
   Contains Interval  |   true    |   true    |   true    |   true    |   false   |   false
   */
  return (
    compareBounds(lhs.start, rhs.start, "start", "start") <= 0 &&
    compareBounds(lhs.end, rhs.end, "end", "end") >= 0
  );
};

/**
 * Returns whether or not the given {@link Timestamp} falls within the span of a given {@link NonNullTimeInterval}.
 *
 * @param {NonNullTimeInterval} interval
 * @param {Timestamp} timestamp
 */
export const intervalContainsTimestamp = (
  interval: NonNullTimeInterval,
  timestamp: Timestamp,
): boolean => {
  /*
   Examples            |     1     |     2     |     3     |     4
   ====================|===========|===========|===========|===========
   Interval            |    [----] |   (--]    |  [--)     | [--]
   Timestamp           |      .    |      .    |     .     |       .
   --------------------|-----------|-----------|-----------|-----------
   Contains Timestamp  |   true    |   true    |   false   |   false
   */
  return (
    compareBounds(
      interval.start,
      { kind: "inclusive", limit: timestamp },
      "start",
      "start",
    ) <= 0 &&
    compareBounds(
      interval.end,
      { kind: "inclusive", limit: timestamp },
      "end",
      "end",
    ) >= 0
  );
};

/**
 * Checks whether there is *any* overlap between two {@link NonNullTimeInterval}
 *
 * @param lhs
 * @param rhs
 */
export const intervalOverlapsInterval = (
  lhs: NonNullTimeInterval,
  rhs: NonNullTimeInterval,
): boolean => {
  /*
   Examples |     1     |     2     |     3     |     4
   =========|===========|===========|===========|===========
   Range A  |    [----] | [--]      | [--]      | [--]
   Range B  | [-----]   |    [--]   |    (--]   |       (--]
   ---------|-----------|-----------|-----------|-----------
   Overlaps |   true    |   true    |   false   |   false
   */
  return (
    (compareBounds(lhs.start, rhs.start, "start", "start") >= 0 &&
      compareBounds(lhs.start, rhs.end, "start", "end") <= 0) ||
    (compareBounds(rhs.start, lhs.start, "start", "start") >= 0 &&
      compareBounds(rhs.start, lhs.end, "start", "end") <= 0)
  );
};

/**
 * Advanced type to provide stronger type information when using {@link intervalIntersectionWithInterval}.
 *
 * If *either* of the `start` {@link TemporalBound}s is bounded, then the resultant `start` {@link TemporalBound} will
 * be bounded, same goes for `end` {@link TemporalBound}s respectively
 */
type IntersectionReturn<
  LhsInterval extends NonNullTimeInterval,
  RhsInterval extends NonNullTimeInterval,
> = [LhsInterval, RhsInterval] extends [
  NonNullTimeInterval<infer LhsStartBound, infer LhsEndBound>,
  NonNullTimeInterval<infer RhsStartBound, infer RhsEndBound>,
]
  ? NonNullTimeInterval<
      LhsStartBound | RhsStartBound extends TimestampLimitedTemporalBound
        ? TimestampLimitedTemporalBound
        : TemporalBound,
      LhsEndBound | RhsEndBound extends TimestampLimitedTemporalBound
        ? TimestampLimitedTemporalBound
        : TemporalBound
    >
  : never;

/**
 * Returns the intersection (overlapping range) of two given {@link NonNullTimeInterval}s, returning `null` if there
 * isn't any.
 *
 * @param {NonNullTimeInterval} lhs
 * @param {NonNullTimeInterval} rhs
 */
export const intervalIntersectionWithInterval = <
  LhsInterval extends NonNullTimeInterval = NonNullTimeInterval,
  RhsInterval extends NonNullTimeInterval = NonNullTimeInterval,
>(
  lhs: LhsInterval,
  rhs: RhsInterval,
): IntersectionReturn<LhsInterval, RhsInterval> | null => {
  /*
   Examples     |     1     |     2
   =============|===========|===========
   Interval A   |   [-----] | [-----]
   Interval B   | [-----]   |   [-----]
   -------------|-----------|-----------
   Intersection |   [---]   |   [---]
   */
  if (!intervalOverlapsInterval(lhs, rhs)) {
    return null;
  } else {
    return {
      start:
        compareBounds(lhs.start, rhs.start, "start", "start") <= 0
          ? rhs.start
          : lhs.start,
      end:
        compareBounds(lhs.end, rhs.end, "end", "end") <= 0 ? lhs.end : rhs.end,
    } as IntersectionReturn<LhsInterval, RhsInterval>;
  }
};

/**
 * Advanced type to provide stronger type information when using {@link intervalMergeWithInterval}.
 *
 * If *both* of the `start` {@link TemporalBound}s are bounded, then the resultant `start` {@link TemporalBound} will be
 * bounded, same goes for end respectively
 */
type MergeReturn<
  LhsInterval extends NonNullTimeInterval,
  RhsInterval extends NonNullTimeInterval,
> = [LhsInterval, RhsInterval] extends [
  NonNullTimeInterval<infer LhsStartBound, infer LhsEndBound>,
  NonNullTimeInterval<infer RhsStartBound, infer RhsEndBound>,
]
  ? NonNullTimeInterval<
      LhsStartBound extends TimestampLimitedTemporalBound
        ? RhsStartBound extends TimestampLimitedTemporalBound
          ? TimestampLimitedTemporalBound
          : TemporalBound
        : TemporalBound,
      LhsEndBound extends TimestampLimitedTemporalBound
        ? RhsEndBound extends TimestampLimitedTemporalBound
          ? TimestampLimitedTemporalBound
          : TemporalBound
        : TemporalBound
    >
  : never;

/**
 * Returns the {@link NonNullTimeInterval} which fully spans the space between the `start` {@link TemporalBound}s and
 * end {@link TemporalBound}s of two provided {@link NonNullTimeInterval}s.
 *
 * If the intervals do not overlap and are not adjacent, the resultant interval will span _more_ space than that spanned
 * by the given intervals. _This is different behavior compared to {@link intervalUnionWithInterval}._
 *
 * @param {NonNullTimeInterval} lhs
 * @param {NonNullTimeInterval} rhs
 */
export const intervalMergeWithInterval = <
  LhsInterval extends NonNullTimeInterval = NonNullTimeInterval,
  RhsInterval extends NonNullTimeInterval = NonNullTimeInterval,
>(
  lhs: LhsInterval,
  rhs: RhsInterval,
): MergeReturn<LhsInterval, RhsInterval> => {
  /*
   Examples   |      1      |      2      |       3       |        4        |      5
   ===========|=============|=============|===============|=================|=============
   Interval A |    [-----]  |  [-----]    | [---]         |         [-----] | [---------]
   Interval B |  [-----]    |    [-----]  |         [---) | (-----]         |   [-----]
   -----------|-------------|-------------|---------------|-----------------|-------------
   Merge      |  [-------]  |  [-------]  | [-----------) | (-------------] | [---------]
   */
  return {
    start:
      compareBounds(lhs.start, rhs.start, "start", "start") <= 0
        ? lhs.start
        : rhs.start,
    end: compareBounds(lhs.end, rhs.end, "end", "end") >= 0 ? lhs.end : rhs.end,
  } as MergeReturn<LhsInterval, RhsInterval>;
};

type UnionReturn<
  LhsInterval extends NonNullTimeInterval,
  RhsInterval extends NonNullTimeInterval,
> =
  | [MergeReturn<LhsInterval, RhsInterval>]
  | [LhsInterval, RhsInterval]
  | [RhsInterval, LhsInterval];

/**
 * Given two {@link NonNullTimeInterval}s, this returns a list of non-adjacent, non-overlapping
 * {@link NonNullTimeInterval}s which span the space spanned by the input intervals.
 *
 * In other words, if the intervals _are_ adjacent, or overlap, then this returns the result of calling
 * {@link intervalMergeWithInterval} on the intervals, otherwise it returns the two intervals back.
 *
 * @param {NonNullTimeInterval}  lhs
 * @param {NonNullTimeInterval}  rhs
 */
export const intervalUnionWithInterval = <
  LhsInterval extends NonNullTimeInterval = NonNullTimeInterval,
  RhsInterval extends NonNullTimeInterval = NonNullTimeInterval,
>(
  lhs: LhsInterval,
  rhs: RhsInterval,
): UnionReturn<LhsInterval, RhsInterval> => {
  /*
   Examples   |      1      |      2      |       3       |        4        |      5
   ===========|=============|=============|===============|=================|=============
   Interval A |    [-----]  |  [-----]    | [---]         |         [-----] | [---------]
   Interval B |  [-----]    |    [-----]  |         [---) | (-----]         |   [-----]
   -----------|-------------|-------------|---------------|-----------------|-------------
   Union      |  [-------]  |  [-------]  | [---]   [---) | (-----] [-----] | [---------]
   */
  if (
    intervalOverlapsInterval(lhs, rhs) ||
    intervalIsAdjacentToInterval(lhs, rhs)
  ) {
    return [intervalMergeWithInterval(lhs, rhs)];
  } else if (compareBounds(lhs.start, rhs.start, "start", "start") < 0) {
    return [lhs, rhs];
  } else {
    return [rhs, lhs];
  }
};

/**
 * Given a collection of {@link NonNullTimeInterval}s, this returns a list of non-adjacent, non-overlapping
 * {@link NonNullTimeInterval}'s which span the space spanned by the input intervals.
 *
 * Conceptually this recursively calls {@link intervalUnionWithInterval} pairwise until all intervals have been unioned
 * with one another. The space spanned by the result will not necessarily be contiguous (may contain gaps).
 *
 * @param {NonNullTimeInterval[]} intervals
 */
export const unionOfIntervals = <IntervalsType extends NonNullTimeInterval>(
  ...intervals: IntervalsType[]
): UnionReturn<IntervalsType, IntervalsType>[number][] => {
  /*
   Examples   |       1       |       2       |       3
   ===========|===============|===============|===============
   Interval A | [--]          | (--]          | [--]
   Interval B |      [-]      |      [-)      |      [-)
   Interval C |  [--]         |  [--]         |  [---]
   Interval D |           [-] |           [-] |        [----]
   -----------|---------------|---------------|---------------
   Union      | [------]  [-] | (------)  [-] | [-----------]
   */
  intervals.sort((intervalA, intervalB) => {
    const startComparison = compareBounds(
      intervalA.start,
      intervalB.start,
      "start",
      "start",
    );

    return startComparison !== 0
      ? startComparison
      : compareBounds(intervalA.end, intervalB.end, "end", "end");
  });

  return intervals.reduce((union, currentInterval) => {
    if (union.length === 0) {
      return [currentInterval];
    } else {
      // The intervals were sorted above, it's only necessary to check the union of this with the last interval, if it
      // overlaps two of the previous ones (which would make it necessary to check the union with more than just the
      // last) then those would have been merged into one in the previous iteration (again because they are sorted).
      return [
        ...union.slice(0, -1),
        ...intervalUnionWithInterval(union.at(-1)!, currentInterval),
      ];
    }
  }, [] as UnionReturn<IntervalsType, IntervalsType>[number][]);
};
