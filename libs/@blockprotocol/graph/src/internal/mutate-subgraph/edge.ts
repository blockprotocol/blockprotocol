import { BaseUri } from "@blockprotocol/type-system/slim";

import { EntityId } from "../../types/entity.js";
import {
  KnowledgeGraphOutwardEdge,
  OntologyOutwardEdge,
  OutwardEdge,
  Subgraph,
} from "../../types/subgraph.js";
import { Timestamp } from "../../types/temporal-versioning.js";
import { isEqual } from "./is-equal.js";

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph}  by adding the given {@link OntologyOutwardEdge} to `edges` object from the
 * given ontology element at the specified version.
 *
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the outward edge
 * @param {BaseUri} sourceBaseUri – the id of the entity the edge is coming from
 * @param {number} atVersion – the version at which the edge should be recorded at
 * @param {OntologyOutwardEdge} outwardEdge – the edge itself
 */
export const addOntologyOutwardEdgeToSubgraphByMutation = <
  Temporal extends boolean,
>(
  subgraph: Subgraph<Temporal>,
  sourceBaseUri: BaseUri,
  atVersion: number,
  outwardEdge: OntologyOutwardEdge,
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  subgraph.edges[sourceBaseUri] ??= {};
  subgraph.edges[sourceBaseUri]![atVersion] ??= [];
  const outwardEdgesAtVersion: OutwardEdge[] =
    subgraph.edges[sourceBaseUri]![atVersion]!;

  if (
    !outwardEdgesAtVersion.find((otherOutwardEdge: OutwardEdge) =>
      isEqual(otherOutwardEdge, outwardEdge),
    )
  ) {
    outwardEdgesAtVersion.push(outwardEdge);
  }
  /* eslint-enable no-param-reassign */
};

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph} by adding the given {@link KnowledgeGraphOutwardEdge} to the `edges` object,
 * from the given entity at the specified timestamp.
 *
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the outward edge
 * @param {EntityId} sourceEntityId – the id of the entity the edge is coming from
 * @param {Timestamp} atTime – the time at which the edge should be recorded as being added at
 * @param {KnowledgeGraphOutwardEdge} outwardEdge – the edge itself
 */
export const addKnowledgeGraphOutwardEdgeToSubgraphByMutation = <
  Temporal extends boolean,
>(
  subgraph: Subgraph<Temporal>,
  sourceEntityId: EntityId,
  atTime: Timestamp,
  outwardEdge: KnowledgeGraphOutwardEdge,
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  subgraph.edges[sourceEntityId] ??= {};
  subgraph.edges[sourceEntityId]![atTime] ??= [];
  const outwardEdgesAtTime: OutwardEdge[] =
    subgraph.edges[sourceEntityId]![atTime]!;

  if (
    !outwardEdgesAtTime.find((otherOutwardEdge: OutwardEdge) =>
      isEqual(otherOutwardEdge, outwardEdge),
    )
  ) {
    outwardEdgesAtTime.push(outwardEdge);
  }
  /* eslint-enable no-param-reassign */
};
