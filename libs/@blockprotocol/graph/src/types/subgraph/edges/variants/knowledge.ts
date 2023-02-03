import { Subtype } from "../../../../util.js";
import { OntologyTypeVertexId } from "../../vertices.js";
import { GenericOutwardEdge } from "../generic-outward-edge.js";
import { KnowledgeGraphEdgeKind, SharedEdgeKind } from "../kind.js";
import { EntityValidInterval, OutwardEdge } from "../outward-edge.js";

export type OutgoingLinkEdge = Subtype<
  GenericOutwardEdge,
  {
    reversed: true;
    kind: "HAS_LEFT_ENTITY";
    rightEndpoint: EntityValidInterval;
  }
>;

export const isOutgoingLinkEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is OutgoingLinkEdge => {
  return outwardEdge.kind === "HAS_LEFT_ENTITY" && outwardEdge.reversed;
};

export type HasLeftEntityEdge = Subtype<
  GenericOutwardEdge,
  {
    reversed: false;
    kind: "HAS_LEFT_ENTITY";
    rightEndpoint: EntityValidInterval;
  }
>;

export const isHasLeftEntityEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is HasLeftEntityEdge => {
  return outwardEdge.kind === "HAS_LEFT_ENTITY" && !outwardEdge.reversed;
};

export type HasRightEntityEdge = Subtype<
  GenericOutwardEdge,
  {
    reversed: false;
    kind: "HAS_RIGHT_ENTITY";
    rightEndpoint: EntityValidInterval;
  }
>;

export const isHasRightEntityEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is HasRightEntityEdge => {
  return outwardEdge.kind === "HAS_RIGHT_ENTITY" && !outwardEdge.reversed;
};

export type IncomingLinkEdge = Subtype<
  GenericOutwardEdge,
  {
    reversed: true;
    kind: "HAS_RIGHT_ENTITY";
    rightEndpoint: EntityValidInterval;
  }
>;

export const isIncomingLinkEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is IncomingLinkEdge => {
  return outwardEdge.kind === "HAS_RIGHT_ENTITY" && outwardEdge.reversed;
};

export type IsOfTypeEdge = Subtype<
  GenericOutwardEdge,
  {
    reversed: false;
    kind: "IS_OF_TYPE";
    rightEndpoint: OntologyTypeVertexId;
  }
>;

export const isIsOfTypeEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is IsOfTypeEdge => {
  return outwardEdge.kind === "IS_OF_TYPE" && !outwardEdge.reversed;
};

export type KnowledgeGraphOutwardEdge =
  | OutgoingLinkEdge
  | IncomingLinkEdge
  | HasLeftEntityEdge
  | HasRightEntityEdge
  | IsOfTypeEdge;

/**
 * This provides a sanity check that we've fully expressed all variants for KnowledgeGraphOutward edges. Should a new
 * variant be required (for example by the introduction of a new `SharedEdgeKind`) `tsc` will report an error.
 *
 * This can be affirmed by commenting out one of the edges above
 */
type _CheckKnowledgeGraphOutwardEdge = Subtype<
  KnowledgeGraphOutwardEdge,
  | GenericOutwardEdge<KnowledgeGraphEdgeKind, boolean, EntityValidInterval>
  | GenericOutwardEdge<SharedEdgeKind, false, OntologyTypeVertexId>
>;
