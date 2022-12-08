import { BaseUri } from "@blockprotocol/type-system/slim";

import { Entity, EntityId, EntityVersion } from "../entity";
import { EntityTypeWithMetadata } from "../ontology/entity-type";

/** @todo - Add the remaining Ontology type vertices */

export type EntityTypeVertex = {
  kind: "entityType";
  inner: EntityTypeWithMetadata;
};

export type EntityVertex = { kind: "entity"; inner: Entity };

export type OntologyVertex = EntityTypeVertex;

export type KnowledgeGraphVertex = EntityVertex;

export type Vertex = OntologyVertex | KnowledgeGraphVertex;

export const isEntityTypeVertex = (
  vertex: Vertex,
): vertex is EntityTypeVertex => {
  return vertex.kind === "entityType";
};

export const isEntityVertex = (vertex: Vertex): vertex is EntityVertex => {
  return vertex.kind === "entity";
};

export type Vertices = {
  [_: BaseUri]: {
    [_: number]: OntologyVertex;
  };
} & {
  [_: EntityId]: {
    [_: EntityVersion]: KnowledgeGraphVertex;
  };
};
