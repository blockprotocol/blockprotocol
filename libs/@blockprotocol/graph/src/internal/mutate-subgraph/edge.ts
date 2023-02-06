import { EntityId } from "../../types/entity.js";
import {
  KnowledgeGraphOutwardEdge,
  KnowledgeGraphRootedEdges,
  OutwardEdge,
  Subgraph,
} from "../../types/subgraph.js";
import { Timestamp } from "../../types/temporal-versioning.js";
import { isEqual } from "./is-equal.js";

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph}  by adding the given outwardEdge to the entity at the specified atTime.
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the outward edge
 * @param {EntityId} sourceEntityId – the id of the entity the edge is coming from
 * @param {Timestamp} atTime – the time at which the edge should be recorded as being added at
 * @param {KnowledgeGraphOutwardEdge} outwardEdge – the edge itself
 */
export const addKnowledgeGraphEdgeToSubgraphByMutation = <
  Temporal extends boolean,
>(
  subgraph: Subgraph<Temporal>,
  sourceEntityId: EntityId,
  atTime: Timestamp,
  outwardEdge: KnowledgeGraphOutwardEdge,
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  if (!subgraph.edges[sourceEntityId]) {
    // This is needed because ts can't differentiate between `EntityId` and `BaseUri`
    (subgraph.edges as KnowledgeGraphRootedEdges)[sourceEntityId] = {
      [atTime]: [outwardEdge],
    };
  } else if (!subgraph.edges[sourceEntityId]![atTime]) {
    subgraph.edges[sourceEntityId]![atTime] = [outwardEdge];
  } else {
    const outwardEdgesAtTime = subgraph.edges[sourceEntityId]![
      atTime
    ]! as KnowledgeGraphOutwardEdge[];
    if (
      !outwardEdgesAtTime.find((otherOutwardEdge: OutwardEdge) =>
        isEqual(otherOutwardEdge, outwardEdge),
      )
    ) {
      outwardEdgesAtTime.push(outwardEdge);
    }
  }

  /* eslint-enable no-param-reassign */
};
