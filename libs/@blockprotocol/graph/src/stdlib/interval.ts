import {
  NonNullTimeInterval,
  TemporalBound,
  Timestamp,
  TimestampLimitedTemporalBound,
} from "../types/temporal-versioning.js";
import { boundIsAdjacentToBound, compareBounds } from "./bound.js";

/**
 * Checks whether two given {@link NonNullTimeInterval}s are adjacent to one another, where adjacency is defined as
 * being next to one another on the timeline, without any points between, *and where they are not overlapping*. Thus,
 * if adjacent, the two intervals should span another given interval.
 *
 * @param left - The first interval of the comparison (order is unimportant)
 * @param right - The second interval of the comparison
 */
export const intervalIsAdjacentToInterval = (
  left: NonNullTimeInterval,
  right: NonNullTimeInterval,
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
    boundIsAdjacentToBound(left.end, right.start) ||
    boundIsAdjacentToBound(left.start, right.end)
  );
};

/**
 * Returns whether or not the `right` {@link NonNullTimeInterval} is *completely contained* within the `left`
 * {@link NonNullTimeInterval}.
 *
 * @param {NonNullTimeInterval} left - Checked if it contains the other
 * @param {NonNullTimeInterval} right - Checked if it's contained _within_ the other
 */
export const intervalContainsInterval = (
  left: NonNullTimeInterval,
  right: NonNullTimeInterval,
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
    compareBounds(left.start, right.start, "start", "start") <= 0 &&
    compareBounds(left.end, right.end, "end", "end") >= 0
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
  const timestampAsBound: TimestampLimitedTemporalBound = {
    kind: "inclusive",
    limit: timestamp,
  };
  /*
   Examples            |     1     |     2     |     3     |     4
   ====================|===========|===========|===========|===========
   Interval            |    [----] |   (--]    |  [--)     | [--]
   Timestamp           |      .    |      .    |     .     |       .
   --------------------|-----------|-----------|-----------|-----------
   Contains Timestamp  |   true    |   true    |   false   |   false
   */
  return (
    compareBounds(interval.start, timestampAsBound, "start", "start") <= 0 &&
    compareBounds(interval.end, timestampAsBound, "end", "end") >= 0
  );
};

/**
 * Checks whether there is *any* overlap between two {@link NonNullTimeInterval}
 *
 * @param left
 * @param right
 */
export const intervalOverlapsInterval = (
  left: NonNullTimeInterval,
  right: NonNullTimeInterval,
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
    (compareBounds(left.start, right.start, "start", "start") >= 0 &&
      compareBounds(left.start, right.end, "start", "end") <= 0) ||
    (compareBounds(right.start, left.start, "start", "start") >= 0 &&
      compareBounds(right.start, left.end, "start", "end") <= 0)
  );
};

/**
 * Advanced type to provide stronger type information when using {@link intervalIntersectionWithInterval}.
 *
 * If *either* of the `start` {@link TemporalBound}s is bounded, then the resultant `start` {@link TemporalBound} will
 * be bounded, same goes for `end` {@link TemporalBound}s respectively
 */
type IntersectionReturn<
  LeftInterval extends NonNullTimeInterval,
  RightInterval extends NonNullTimeInterval,
> = [LeftInterval, RightInterval] extends [
  NonNullTimeInterval<infer LeftStartBound, infer LeftEndBound>,
  NonNullTimeInterval<infer RightStartBound, infer RightEndBound>,
]
  ? NonNullTimeInterval<
      LeftStartBound | RightStartBound extends TimestampLimitedTemporalBound
        ? TimestampLimitedTemporalBound
        : TemporalBound,
      LeftEndBound | RightEndBound extends TimestampLimitedTemporalBound
        ? TimestampLimitedTemporalBound
        : TemporalBound
    >
  : never;

/**
 * Returns the intersection (overlapping range) of two given {@link NonNullTimeInterval}s, returning `null` if there
 * isn't any.
 *
 * @param {NonNullTimeInterval} left
 * @param {NonNullTimeInterval} right
 */
export const intervalIntersectionWithInterval = <
  LeftInterval extends NonNullTimeInterval = NonNullTimeInterval,
  RightInterval extends NonNullTimeInterval = NonNullTimeInterval,
>(
  left: LeftInterval,
  right: RightInterval,
): IntersectionReturn<LeftInterval, RightInterval> | null => {
  /*
   Examples     |     1     |     2
   =============|===========|===========
   Interval A   |   [-----] | [-----]
   Interval B   | [-----]   |   [-----]
   -------------|-----------|-----------
   Intersection |   [---]   |   [---]
   */
  if (!intervalOverlapsInterval(left, right)) {
    return null;
  } else {
    return {
      start:
        compareBounds(left.start, right.start, "start", "start") <= 0
          ? right.start
          : left.start,
      end:
        compareBounds(left.end, right.end, "end", "end") <= 0
          ? left.end
          : right.end,
    } as IntersectionReturn<LeftInterval, RightInterval>;
  }
};

/**
 * Advanced type to provide stronger type information when using {@link intervalMergeWithInterval}.
 *
 * If *both* of the `start` {@link TemporalBound}s are bounded, then the resultant `start` {@link TemporalBound} will be
 * bounded, same goes for end respectively
 */
type MergeReturn<
  LeftInterval extends NonNullTimeInterval,
  RightInterval extends NonNullTimeInterval,
> = [LeftInterval, RightInterval] extends [
  NonNullTimeInterval<infer LeftStartBound, infer LeftEndBound>,
  NonNullTimeInterval<infer RightStartBound, infer RightEndBound>,
]
  ? NonNullTimeInterval<
      LeftStartBound extends TimestampLimitedTemporalBound
        ? RightStartBound extends TimestampLimitedTemporalBound
          ? TimestampLimitedTemporalBound
          : TemporalBound
        : TemporalBound,
      LeftEndBound extends TimestampLimitedTemporalBound
        ? RightEndBound extends TimestampLimitedTemporalBound
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
 * @param {NonNullTimeInterval} left
 * @param {NonNullTimeInterval} right
 */
export const intervalMergeWithInterval = <
  LeftInterval extends NonNullTimeInterval = NonNullTimeInterval,
  RightInterval extends NonNullTimeInterval = NonNullTimeInterval,
>(
  left: LeftInterval,
  right: RightInterval,
): MergeReturn<LeftInterval, RightInterval> => {
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
      compareBounds(left.start, right.start, "start", "start") <= 0
        ? left.start
        : right.start,
    end:
      compareBounds(left.end, right.end, "end", "end") >= 0
        ? left.end
        : right.end,
  } as MergeReturn<LeftInterval, RightInterval>;
};

type UnionReturn<
  LeftInterval extends NonNullTimeInterval,
  RightInterval extends NonNullTimeInterval,
> =
  | [MergeReturn<LeftInterval, RightInterval>]
  | [LeftInterval, RightInterval]
  | [RightInterval, LeftInterval];

/**
 * Given two {@link NonNullTimeInterval}s, this returns a list of non-adjacent, non-overlapping
 * {@link NonNullTimeInterval}s which span the space spanned by the input intervals.
 *
 * In other words, if the intervals _are_ adjacent, or overlap, then this returns the result of calling
 * {@link intervalMergeWithInterval} on the intervals, otherwise it returns the two intervals back.
 *
 * @param {NonNullTimeInterval}  left
 * @param {NonNullTimeInterval}  right
 */
export const intervalUnionWithInterval = <
  LeftInterval extends NonNullTimeInterval = NonNullTimeInterval,
  RightInterval extends NonNullTimeInterval = NonNullTimeInterval,
>(
  left: LeftInterval,
  right: RightInterval,
): UnionReturn<LeftInterval, RightInterval> => {
  /*
   Examples   |      1      |      2      |       3       |        4        |      5
   ===========|=============|=============|===============|=================|=============
   Interval A |    [-----]  |  [-----]    | [---]         |         [-----] | [---------]
   Interval B |  [-----]    |    [-----]  |         [---) | (-----]         |   [-----]
   -----------|-------------|-------------|---------------|-----------------|-------------
   Union      |  [-------]  |  [-------]  | [---]   [---) | (-----] [-----] | [---------]
   */
  if (
    intervalOverlapsInterval(left, right) ||
    intervalIsAdjacentToInterval(left, right)
  ) {
    return [intervalMergeWithInterval(left, right)];
  } else if (compareBounds(left.start, right.start, "start", "start") < 0) {
    return [left, right];
  } else {
    return [right, left];
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
