import { BaseUrl } from "@blockprotocol/type-system/slim";

import { EntityId } from "../../shared/types/entity.js";
import {
  OntologyTypeRevisionId,
  OutwardEdge,
  Subgraph,
} from "../../shared/types/subgraph.js";
import { Timestamp } from "../../shared/types/temporal-versioning.js";
import { isEqual } from "./is-equal.js";

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph}  by adding the given {@link OutwardEdge} to `edges` object from the
 * given element at the specified point.
 *
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the outward edge
 * @param {EntityId | BaseUrl} sourceBaseId – the id of the element the edge is coming from
 * @param {string} at – the identifier for the revision, or the timestamp, at which the edge was added
 * @param {OutwardEdge} outwardEdge – the edge itself
 */
export const addOutwardEdgeToSubgraphByMutation = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  sourceBaseId: EntityId | BaseUrl,
  at: OntologyTypeRevisionId | Timestamp,
  outwardEdge: OutwardEdge<Temporal>,
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  subgraph.edges[sourceBaseId] ??= {};
  subgraph.edges[sourceBaseId]![at] ??= [];
  const outwardEdgesAtVersion: OutwardEdge<Temporal>[] =
    subgraph.edges[sourceBaseId]![at]!;

  if (
    !outwardEdgesAtVersion.find((otherOutwardEdge: OutwardEdge<Temporal>) =>
      isEqual(otherOutwardEdge, outwardEdge),
    )
  ) {
    outwardEdgesAtVersion.push(outwardEdge);
  }
  /* eslint-enable no-param-reassign */
};
