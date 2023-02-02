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
 * A range of time from a given `start` {@link TemporalBound} (or lack of) to a given `end` {@link TemporalBound} (or
 * lack of), where `start` is strictly before or equal to `end`.
 */
export type TimeInterval<
  StartBound extends TemporalBound | null,
  EndBound extends TemporalBound | null,
> = {
  start: StartBound;
  end: EndBound;
};

export type NonNullTimeInterval<
  StartBound extends TemporalBound = TemporalBound,
  EndBound extends TemporalBound = TemporalBound,
> = TimeInterval<StartBound, EndBound>;

export type BoundedTimeInterval = TimeInterval<
  LimitedTemporalBound,
  LimitedTemporalBound
>;

/**
 * A representation of a "variable" temporal axis, which is optionally bounded to a given {@link TimeInterval}.
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
  interval: TimeInterval<StartBound, EndBound>;
};

/**
 * A representation of a "pinned" temporal axis, used to project another temporal axis along the given
 * {@link Timestamp}.
 *
 * In a bitemporal system, a {@link PinnedTemporalAxis} should almost always be accompanied by a
 * {@link VariableTemporalAxis}.
 */
export type PinnedTemporalAxis<Axis extends TemporalAxes> = {
  axis: Axis;
  timestamp: Timestamp;
};
