import { EntityId, isEntityRecordId } from "../../entity.js";
import { isOntologyTypeRecordId } from "../../ontology.js";
import {
  LimitedTemporalBound,
  TemporalBound,
  TimeInterval,
  Timestamp,
} from "../../temporal-versioning.js";
import {
  isKnowledgeGraphEdgeKind,
  isOntologyEdgeKind,
  isSharedEdgeKind,
} from "./kind.js";
import { KnowledgeGraphOutwardEdge } from "./variants/knowledge.js";
import { OntologyOutwardEdge } from "./variants/ontology.js";

/**
 * A simple tuple type which identifies an {@link Entity} by its {@link EntityId}, at a given {@link Timestamp}.
 *
 * When using this to query a {@link Subgraph}, along its variable axis, this should identify a single unique revision
 * of an {@link Entity} or possibly refer to nothing.
 */
export type EntityIdWithTimestamp = {
  baseId: EntityId;
  timestamp: Timestamp;
};

/**
 * A simple tuple type which identifies an {@link Entity} by its {@link EntityId}, over a given {@link TimeInterval}.
 *
 * When using this to query a {@link Subgraph}, along its variable axis, this could return any number of revisions
 * of an {@link Entity} (including possibly returning none).
 */
export type EntityIdWithInterval = {
  entityId: EntityId;
  interval: TimeInterval<LimitedTemporalBound, TemporalBound>;
};

export type OutwardEdge = OntologyOutwardEdge | KnowledgeGraphOutwardEdge;

// -------------------------------- Type Guards --------------------------------

export const isOntologyOutwardEdge = (
  edge: OutwardEdge,
): edge is OntologyOutwardEdge => {
  return (
    isOntologyEdgeKind(edge.kind) ||
    (isSharedEdgeKind(edge.kind) && isEntityRecordId(edge.rightEndpoint))
  );
};

export const isKnowledgeGraphOutwardEdge = (
  edge: OutwardEdge,
): edge is KnowledgeGraphOutwardEdge => {
  return (
    isKnowledgeGraphEdgeKind(edge.kind) ||
    (isSharedEdgeKind(edge.kind) && isOntologyTypeRecordId(edge.rightEndpoint))
  );
};
