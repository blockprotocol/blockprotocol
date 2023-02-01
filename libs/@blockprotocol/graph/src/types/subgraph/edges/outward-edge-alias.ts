/**
 * A collection of 'aliases' which describe various variants of outward edges in more accessible-forms
 */

import { Subtype } from "../../../util.js";
import { OntologyTypeVertexId } from "../vertices";
import {
  EntityIdAndTimestamp,
  KnowledgeGraphOutwardEdge,
  OntologyOutwardEdge,
  OutwardEdge,
} from "./outward-edge.js";

export type OutgoingLinkEdge = Subtype<
  KnowledgeGraphOutwardEdge,
  {
    reversed: true;
    kind: "HAS_LEFT_ENTITY";
    rightEndpoint: EntityIdAndTimestamp;
  }
>;

export const isOutgoingLinkEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is OutgoingLinkEdge => {
  return outwardEdge.kind === "HAS_LEFT_ENTITY" && outwardEdge.reversed;
};

export type HasLeftEntityEdge = Subtype<
  KnowledgeGraphOutwardEdge,
  {
    reversed: false;
    kind: "HAS_LEFT_ENTITY";
    rightEndpoint: EntityIdAndTimestamp;
  }
>;

export const isHasLeftEntityEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is HasLeftEntityEdge => {
  return outwardEdge.kind === "HAS_LEFT_ENTITY" && !outwardEdge.reversed;
};

export type HasRightEntityEdge = Subtype<
  KnowledgeGraphOutwardEdge,
  {
    reversed: false;
    kind: "HAS_RIGHT_ENTITY";
    rightEndpoint: EntityIdAndTimestamp;
  }
>;

export const isHasRightEntityEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is HasRightEntityEdge => {
  return outwardEdge.kind === "HAS_RIGHT_ENTITY" && !outwardEdge.reversed;
};

export type IncomingLinkEdge = Subtype<
  KnowledgeGraphOutwardEdge,
  {
    reversed: true;
    kind: "HAS_RIGHT_ENTITY";
    rightEndpoint: EntityIdAndTimestamp;
  }
>;

export const isIncomingLinkEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is IncomingLinkEdge => {
  return outwardEdge.kind === "HAS_RIGHT_ENTITY" && outwardEdge.reversed;
};

export type ConstrainsPropertiesOnEdge = Subtype<
  OntologyOutwardEdge,
  {
    reversed: false;
    kind: "CONSTRAINS_PROPERTIES_ON";
    rightEndpoint: OntologyTypeVertexId;
  }
>;

export const isConstrainsPropertiesOnEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is ConstrainsPropertiesOnEdge => {
  return (
    outwardEdge.kind === "CONSTRAINS_PROPERTIES_ON" && !outwardEdge.reversed
  );
};
