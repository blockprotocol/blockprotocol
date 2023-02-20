import {
  GraphElementVertexId as GraphElementVertexIdNonTemporal,
  GraphResolveDepths,
  Subgraph as SubgraphNonTemporal,
  Vertex as VertexNonTemporal,
} from "@blockprotocol/graph";
import { isTemporalSubgraph } from "@blockprotocol/graph/internal";
import {
  GraphElementVertexId as GraphElementVertexIdTemporal,
  Subgraph as SubgraphTemporal,
  TimeInterval,
  Vertex as VertexTemporal,
} from "@blockprotocol/graph/temporal";

import {
  TraversalSubgraph as TraversalSubgraphNonTemporal,
  traverseElement as traverseElementNonTemporal,
} from "./traverse/non-temporal";
import {
  TraversalSubgraph as TraversalSubgraphTemporal,
  traverseElement as traverseElementTemporal,
} from "./traverse/temporal";

const isTemporalTraversalSubgraph = (
  traversalSubgraph: TraversalSubgraphTemporal | TraversalSubgraphNonTemporal,
): traversalSubgraph is TraversalSubgraphTemporal => {
  // this cast should be safe as all we're doing is checking if a property is defined
  return (
    (traversalSubgraph as TraversalSubgraphTemporal)?.temporalAxes !== undefined
  );
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
  traversalSubgraph: Temporal extends true
    ? TraversalSubgraphTemporal
    : TraversalSubgraphNonTemporal;
  datastore: Temporal extends true ? SubgraphTemporal : SubgraphNonTemporal;
  element: Temporal extends true ? VertexTemporal : VertexNonTemporal;
  elementIdentifier: Temporal extends true
    ? GraphElementVertexIdTemporal
    : GraphElementVertexIdNonTemporal;
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
    return traverseElementNonTemporal({
      traversalSubgraph: traversalSubgraph as TraversalSubgraphNonTemporal,
      datastore: datastore as SubgraphNonTemporal,
      element: element as VertexTemporal,
      elementIdentifier,
      currentTraversalDepths,
    });
  } else {
    throw new Error(
      `Invalid arguments, expected all fields to consistently support temporal versioning or not. Mixed ` +
        `temporal/non-temporal arguments are not supported.`,
    );
  }
};
