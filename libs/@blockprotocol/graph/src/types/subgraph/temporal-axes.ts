import {
  LimitedTemporalBound,
  PinnedTemporalAxis,
  TemporalBound,
  VariableTemporalAxis,
} from "../temporal-versioning.js";

/**
 * Defines the two possible combinations of pinned/variable temporal axes that are used in queries that return
 * {@link Subgraph}`s.
 *
 * The {@link VariableTemporalAxis} is optionally bounded, in the absence of provided bounds an inclusive bound at the
 * timestamp at point of resolving is assumed.
 */
export type UnresolvedQueryTemporalAxes =
  | {
      variable: VariableTemporalAxis<
        "decisionTime",
        TemporalBound | null,
        LimitedTemporalBound | null
      >;
      pinned: PinnedTemporalAxis<"transactionTime">;
    }
  | {
      variable: VariableTemporalAxis<
        "transactionTime",
        TemporalBound | null,
        LimitedTemporalBound | null
      >;
      pinned: PinnedTemporalAxis<"decisionTime">;
    };

/**
 * Defines the two possible combinations of pinned/variable temporal axes that are used in responses to queries that
 * return {@link Subgraph}`s.
 *
 * The {@link VariableTemporalAxis} is bounded according to the input of the query (where absent bounds in the input are
 * interpreted as described in the docs for {@link UnresolvedQueryTemporalAxes})
 */
export type ResolvedQueryTemporalAxes =
  | {
      variable: VariableTemporalAxis<
        "decisionTime",
        TemporalBound,
        LimitedTemporalBound
      >;
      pinned: PinnedTemporalAxis<"transactionTime">;
    }
  | {
      variable: VariableTemporalAxis<
        "transactionTime",
        TemporalBound,
        LimitedTemporalBound
      >;
      pinned: PinnedTemporalAxis<"decisionTime">;
    };

/**
 * Denotes the temporal axes used in constructing the {@link Subgraph}.
 */
export type SubgraphTemporalAxes = {
  /**
   * The {@link UnresolvedQueryTemporalAxes} provided in the query
   */
  initial: UnresolvedQueryTemporalAxes;
  /**
   * The {@link ResolvedQueryTemporalAxes} used when resolving the {@link Subgraph}
   */
  resolved: ResolvedQueryTemporalAxes;
};
