/**
 * A collection of 'aliases' which describe various variants of outward edges in more accessible-forms
 */

import { EntityIdAndTimestamp, OutwardEdge } from "./outward-edge";

/** @todo - is there a way to have TS force us to make this always satisfy `KnowledgeGraphOutwardEdge`? */
export type OutwardLinkEdge = {
  reversed: true;
  kind: "HAS_LEFT_ENTITY";
  rightEndpoint: EntityIdAndTimestamp;
};

export const isOutwardLinkEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is OutwardLinkEdge => {
  return outwardEdge.kind === "HAS_LEFT_ENTITY" && outwardEdge.reversed;
};

/** @todo - is there a way to have TS force us to make this always satisfy `KnowledgeGraphOutwardEdge`? */
export type HasLeftEntityEdge = {
  reversed: false;
  kind: "HAS_LEFT_ENTITY";
  rightEndpoint: EntityIdAndTimestamp;
};

export const isHasLeftEntityEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is HasLeftEntityEdge => {
  return outwardEdge.kind === "HAS_LEFT_ENTITY" && !outwardEdge.reversed;
};

/** @todo - is there a way to have TS force us to make this always satisfy `KnowledgeGraphOutwardEdge`? */
export type HasRightEntityEdge = {
  reversed: false;
  kind: "HAS_RIGHT_ENTITY";
  rightEndpoint: EntityIdAndTimestamp;
};

export const isHasRightEntityEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is HasRightEntityEdge => {
  return outwardEdge.kind === "HAS_RIGHT_ENTITY" && !outwardEdge.reversed;
};

/** @todo - is there a way to have TS force us to make this always satisfy `KnowledgeGraphOutwardEdge`? */
export type IncomingLinkEdge = {
  reversed: true;
  kind: "HAS_RIGHT_ENTITY";
  rightEndpoint: EntityIdAndTimestamp;
};

export const isIncomingLinkEdge = (
  outwardEdge: OutwardEdge,
): outwardEdge is IncomingLinkEdge => {
  return outwardEdge.kind === "HAS_RIGHT_ENTITY" && outwardEdge.reversed;
};
