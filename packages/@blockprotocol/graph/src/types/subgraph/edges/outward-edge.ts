import { EntityId } from "../../entity";
import { Timestamp } from "../time";
import { isKnowledgeGraphEdgeKind, KnowledgeGraphEdgeKind } from "./kind";

/**
 * A "partial" definition of an edge which is complete when joined with the missing left-endpoint (usually the source
 * of the edge)
 */
type GenericOutwardEdge<K, E> = {
  kind: K;
  reversed: boolean;
  rightEndpoint: E;
};

/** @todo - Add the Ontology outward edges */
export type KnowledgeGraphOutwardEdge = GenericOutwardEdge<
  KnowledgeGraphEdgeKind,
  {
    baseId: EntityId;
    timestamp: Timestamp;
  }
>;

/** @todo - Add the Ontology outward edges */
export type OutwardEdge = KnowledgeGraphOutwardEdge;

export const isKnowledgeGraphOutwardEdge = (
  edge: OutwardEdge,
): edge is KnowledgeGraphOutwardEdge => {
  return isKnowledgeGraphEdgeKind(edge.kind);
};
