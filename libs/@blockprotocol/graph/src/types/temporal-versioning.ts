/**
 * Types used in embedding applications and blocks that support multi-axis temporal versioning schemes.
 */

import { Subtype } from "../util.js";

/**
 * An ISO 8601 formatted timestamp string
 */
export type Timestamp = string;

/**
 * @todo - doc
 */
export type TemporalAxes = "transactionTime" | "decisionTime";

/**
 * The bound of a time-interval that is either exclusively or inclusively limited by a `Timestamp`
 */
export type LimitedTemporalBound = {
  kind: "inclusive" | "exclusive";
  limit: Timestamp;
};

export type InclusiveLimitedTemporalBound = Subtype<
  LimitedTemporalBound,
  {
    kind: "inclusive";
    limit: Timestamp;
  }
>;

export type ExclusiveLimitedTemporalBound = Subtype<
  LimitedTemporalBound,
  {
    kind: "exclusive";
    limit: Timestamp;
  }
>;

export type Unbounded = { kind: "unbounded" };

/**
 * The bound (or explicit lack of a bound) of a time-interval
 */
export type TemporalBound = Unbounded | LimitedTemporalBound;

/**
 * A representation of an interval of time, where the bounds of the interval may be omitted (represented by `null`) to
 * be post-processed at a later stage.
 *
 * An example of how this may be useful is taking an interval that statically should refer to "the current time".
 * Leaving a bound unspecified means that the `null` can be replaced at time of resolution with the current clock, while
 * leaving the parameters of the query as statically defined.
 */
export type TimeIntervalUnresolved<
  StartBound extends TemporalBound | null,
  EndBound extends TemporalBound | null,
> = {
  start: StartBound;
  end: EndBound;
};

/**
 * A range of time from a given `start` {@link TemporalBound} to a given `end` {@link TemporalBound}, where `start` is
 * strictly before or equal to `end`.
 */
export type TimeInterval<
  StartBound extends TemporalBound = TemporalBound,
  EndBound extends TemporalBound = TemporalBound,
> = TimeIntervalUnresolved<StartBound, EndBound>;

/**
 * A range of time from a given `start` to a given `end` where both bounds are {@link Timestamp}s, and where `start` is
 * strictly before or equal to `end`.
 */
export type BoundedTimeInterval = TimeInterval<
  LimitedTemporalBound,
  LimitedTemporalBound
>;

/**
 * A representation of a "variable" temporal axis, which is optionally bounded to a given {@link TimeIntervalUnresolved}.
 *
 * In a bitemporal system, a {@link VariableTemporalAxis} should almost always be accompanied by a
 * {@link PinnedTemporalAxis}.
 */
export type VariableTemporalAxis<
  Axis extends TemporalAxes,
  StartBound extends TemporalBound | null,
  EndBound extends LimitedTemporalBound | null,
> = {
  axis: Axis;
  interval: TimeIntervalUnresolved<StartBound, EndBound>;
};

/**
 * A representation of a "pinned" temporal axis, used to project another temporal axis along the given
 * {@link Timestamp}. If the `timestamp` is set to `null`, then it will be filled in with the current time _when a query
 * is being resolved._
 *
 * In a bitemporal system, a {@link PinnedTemporalAxis} should almost always be accompanied by a
 * {@link VariableTemporalAxis}.
 */
export type PinnedTemporalAxis<
  Axis extends TemporalAxes,
  PinnedTime extends Timestamp | null,
> = {
  axis: Axis;
  timestamp: PinnedTime;
};
