import {
  LimitedTemporalBound,
  TemporalBound,
  TimeInterval,
} from "../types/temporal-versioning";
import { intervalUnionWithInterval, sortIntervals } from "./interval";

/**
 * Given a collection of {@link TimeInterval}s, this returns a list of non-adjacent, non-overlapping
 * {@link TimeInterval}'s which span the space spanned by the input intervals.
 *
 * Conceptually this recursively calls {@link intervalUnionWithInterval} pairwise until all intervals have been unioned
 * with one another. The space spanned by the result will not necessarily be contiguous (may contain gaps).
 *
 * @param {TimeInterval[]} intervals
 */
export const unionOfIntervals = <IntervalsType extends TimeInterval>(
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
  sortIntervals(intervals);

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

export type UnionReturn<
  LeftInterval extends TimeInterval,
  RightInterval extends TimeInterval,
> =
  | [MergeReturn<LeftInterval, RightInterval>]
  | [LeftInterval, RightInterval]
  | [RightInterval, LeftInterval];

/**
 * Advanced type to provide stronger type information when using {@link intervalMergeWithInterval}.
 *
 * If *both* of the `start` {@link TemporalBound}s are bounded, then the resultant `start` {@link TemporalBound} will be
 * bounded, same goes for end respectively
 */
export type MergeReturn<
  LeftInterval extends TimeInterval,
  RightInterval extends TimeInterval,
> = [LeftInterval, RightInterval] extends [
  TimeInterval<infer LeftStartBound, infer LeftEndBound>,
  TimeInterval<infer RightStartBound, infer RightEndBound>,
]
  ? TimeInterval<
      LeftStartBound extends LimitedTemporalBound
        ? RightStartBound extends LimitedTemporalBound
          ? LimitedTemporalBound
          : TemporalBound
        : TemporalBound,
      LeftEndBound extends LimitedTemporalBound
        ? RightEndBound extends LimitedTemporalBound
          ? LimitedTemporalBound
          : TemporalBound
        : TemporalBound
    >
  : never;
