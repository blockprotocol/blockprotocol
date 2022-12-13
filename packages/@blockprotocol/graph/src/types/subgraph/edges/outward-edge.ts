import { EntityEditionId, EntityId, isEntityEditionId } from "../../entity.js";
import {
  isOntologyTypeEditionId,
  OntologyTypeEditionId,
} from "../../ontology.js";
import { Timestamp } from "../time.js";
import {
  isKnowledgeGraphEdgeKind,
  isOntologyEdgeKind,
  isSharedEdgeKind,
  KnowledgeGraphEdgeKind,
  OntologyEdgeKind,
  SharedEdgeKind,
} from "./kind.js";

/**
 * A "partial" definition of an edge which is complete when joined with the missing left-endpoint (usually the source
 * of the edge)
 */
type GenericOutwardEdge<
  EdgeKind extends KnowledgeGraphEdgeKind | OntologyEdgeKind | SharedEdgeKind,
  Endpoint,
  Reversed extends boolean = boolean,
> = {
  kind: EdgeKind;
  reversed: Reversed;
  rightEndpoint: Endpoint;
};

export type EntityIdAndTimestamp = {
  baseId: EntityId;
  timestamp: Timestamp;
};

export type OntologyOutwardEdge =
  | GenericOutwardEdge<OntologyEdgeKind, OntologyTypeEditionId>
  | GenericOutwardEdge<SharedEdgeKind, EntityEditionId, true>;

export type KnowledgeGraphOutwardEdge =
  | GenericOutwardEdge<KnowledgeGraphEdgeKind, EntityIdAndTimestamp>
  | GenericOutwardEdge<SharedEdgeKind, OntologyTypeEditionId, false>;

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
