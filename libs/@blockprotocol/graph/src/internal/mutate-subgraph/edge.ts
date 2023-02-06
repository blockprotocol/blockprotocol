import { BaseUri } from "@blockprotocol/type-system/slim";

import { EntityId } from "../../types/entity.js";
import {
  OntologyTypeRevisionId,
  OutwardEdge,
  Subgraph,
} from "../../types/subgraph.js";
import { Timestamp } from "../../types/temporal-versioning.js";
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
 * @param {EntityId | BaseUri} sourceBaseId – the id of the element the edge is coming from
 * @param {string} at – the identifier for the revision, or the timestamp, at which the edge was added
 * @param {OutwardEdge} outwardEdge – the edge itself
 */
export const addOutwardEdgeToSubgraphByMutation = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  sourceBaseId: EntityId | BaseUri,
  at: OntologyTypeRevisionId | Timestamp,
  outwardEdge: OutwardEdge,
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  subgraph.edges[sourceBaseId] ??= {};
  subgraph.edges[sourceBaseId]![at] ??= [];
  const outwardEdgesAtVersion: OutwardEdge[] =
    subgraph.edges[sourceBaseId]![at]!;

  if (
    !outwardEdgesAtVersion.find((otherOutwardEdge: OutwardEdge) =>
      isEqual(otherOutwardEdge, outwardEdge),
    )
  ) {
    outwardEdgesAtVersion.push(outwardEdge);
  }
  /* eslint-enable no-param-reassign */
};
