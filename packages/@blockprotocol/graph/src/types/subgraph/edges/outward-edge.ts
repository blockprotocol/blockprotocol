import { EntityEditionId, EntityId, isEntityEditionId } from "../../entity";
import { isOntologyTypeEditionId, OntologyTypeEditionId } from "../../ontology";
import { Timestamp } from "../time";
import {
  isKnowledgeGraphEdgeKind,
  isOntologyEdgeKind,
  isSharedEdgeKind,
  KnowledgeGraphEdgeKind,
  OntologyEdgeKind,
  SharedEdgeKind,
} from "./kind";

/**
 * A "partial" definition of an edge which is complete when joined with the missing left-endpoint (usually the source
 * of the edge)
 */
type GenericOutwardEdge<K, E> = {
  kind: K;
  reversed: boolean;
  rightEndpoint: E;
};

export type EntityIdAndTimestamp = {
  baseId: EntityId;
  timestamp: Timestamp;
};

export type OntologyOutwardEdge =
  | GenericOutwardEdge<OntologyEdgeKind, OntologyTypeEditionId>
  | GenericOutwardEdge<SharedEdgeKind, EntityEditionId>;

export type KnowledgeGraphOutwardEdge =
  | GenericOutwardEdge<KnowledgeGraphEdgeKind, EntityIdAndTimestamp>
  | GenericOutwardEdge<SharedEdgeKind, OntologyTypeEditionId>;

export type OutwardEdge = OntologyOutwardEdge | KnowledgeGraphOutwardEdge;

// -------------------------------- Type Guards --------------------------------

export const isOntologyOutwardEdge = (
  edge: OutwardEdge,
): edge is OntologyOutwardEdge => {
  return (
    isOntologyEdgeKind(edge.kind) ||
    (isSharedEdgeKind(edge.kind) && isEntityEditionId(edge.rightEndpoint))
  );
};

export const isKnowledgeGraphOutwardEdge = (
  edge: OutwardEdge,
): edge is KnowledgeGraphOutwardEdge => {
  return (
    isKnowledgeGraphEdgeKind(edge.kind) ||
    (isSharedEdgeKind(edge.kind) && isOntologyTypeEditionId(edge.rightEndpoint))
  );
};
