import { EntityId, isEntityRecordId } from "../../entity.js";
import { isOntologyTypeRecordId } from "../../ontology.js";
import { Timestamp } from "../../temporal-versioning.js";
import { EntityVertexId, OntologyTypeVertexId } from "../vertices";
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
  | GenericOutwardEdge<OntologyEdgeKind, OntologyTypeVertexId>
  | GenericOutwardEdge<SharedEdgeKind, EntityVertexId, true>;

export type KnowledgeGraphOutwardEdge =
  | GenericOutwardEdge<KnowledgeGraphEdgeKind, EntityIdAndTimestamp>
  | GenericOutwardEdge<SharedEdgeKind, OntologyTypeVertexId, false>;

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
