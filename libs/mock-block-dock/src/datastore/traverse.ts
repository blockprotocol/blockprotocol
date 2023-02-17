import {
  GraphElementVertexId,
  GraphResolveDepths,
  Subgraph,
  TimeInterval,
  Vertex,
} from "@blockprotocol/graph";
import {
  GraphElementVertexId as GraphElementVertexIdTemporal,
  isTemporalSubgraph,
  Subgraph as SubgraphTemporal,
  Vertex as VertexTemporal,
} from "@blockprotocol/graph/temporal";

import {
  TraversalSubgraph as TraversalSubgraphTemporal,
  traverseElement as traverseElementTemporal,
} from "./traverse/temporal";

/* @todo - Update this */
const isTemporalTraversalSubgraph = (
  traversalSubgraph: TraversalSubgraphTemporal | null,
): traversalSubgraph is TraversalSubgraphTemporal => {
  return traversalSubgraph?.temporalAxes !== undefined;
};

/** @todo - Update this to handle ontology edges */
/**
 * Recursive implementation of {@link Subgraph} traversal. This explores neighbors of the given element {@link Vertex}
 * along the specified edge kinds and depths given in the {@link GraphResolveDepths}.
 *
 * This optionally has support for additional temporal-versioning related querying, searching only for neighbors (and
 * traversing only) in the specified {@link TimeInterval}.
 *
 * @param {TraversalSubgraph} traversalSubgraph
 * @param {Subgraph} datastore
 * @param {Vertex} element
 * @param {GraphElementVertexId} elementIdentifier
 * @param {GraphResolveDepths} currentTraversalDepths
 * @param {TimeInterval} interval
 */
export const traverseElement = <Temporal extends boolean>({
  traversalSubgraph,
  datastore,
  element,
  elementIdentifier,
  currentTraversalDepths,
  interval,
}: {
  /* @todo - accept non-temporal subgraph */
  traversalSubgraph: Temporal extends true ? TraversalSubgraphTemporal : null;
  datastore: Temporal extends true ? SubgraphTemporal : Subgraph;
  element: Temporal extends true ? VertexTemporal : Vertex;
  elementIdentifier: Temporal extends true
    ? GraphElementVertexIdTemporal
    : GraphElementVertexId;
  currentTraversalDepths: GraphResolveDepths;
  interval: Temporal extends true ? TimeInterval : undefined;
}) => {
  if (
    isTemporalTraversalSubgraph(traversalSubgraph) &&
    isTemporalSubgraph(datastore) &&
    interval
  ) {
    return traverseElementTemporal({
      traversalSubgraph: traversalSubgraph as TraversalSubgraphTemporal,
      datastore: datastore as SubgraphTemporal,
      element: element as VertexTemporal,
      elementIdentifier,
      interval: interval as TimeInterval,
      currentTraversalDepths,
    });
  } else if (
    !isTemporalTraversalSubgraph(traversalSubgraph) &&
    !isTemporalSubgraph(datastore) &&
    !interval
  ) {
    /** @todo - implement this once temporal versioning is configurable in MBD */
    throw new Error(`Non-versioned traversal is currently unsupported`);
  } else {
    throw new Error(
      `Invalid arguments, expected all fields to consistently support temporal versioning or not. Mixed ` +
        `
      temporal/non-temporal arguments are not supported.`,
    );
  }
};
