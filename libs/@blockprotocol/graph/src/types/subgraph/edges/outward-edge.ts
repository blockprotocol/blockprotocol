import { EntityId, isEntityRecordId } from "../../entity.js";
import { isOntologyTypeRecordId } from "../../ontology.js";
import { Timestamp } from "../../temporal-versioning.js";
import {
  isKnowledgeGraphEdgeKind,
  isOntologyEdgeKind,
  isSharedEdgeKind,
} from "./kind.js";
import { KnowledgeGraphOutwardEdge } from "./variants/knowledge";
import { OntologyOutwardEdge } from "./variants/ontology";

export type EntityIdAndTimestamp = {
  baseId: EntityId;
  timestamp: Timestamp;
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
