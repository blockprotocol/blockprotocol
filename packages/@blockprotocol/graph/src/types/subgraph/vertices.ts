import { BaseUri } from "@blockprotocol/type-system/slim";

import { Entity, EntityId, EntityVersion } from "../entity";
import { DataTypeWithMetadata } from "../ontology/data-type";
import { EntityTypeWithMetadata } from "../ontology/entity-type";
import { PropertyTypeWithMetadata } from "../ontology/property-type";

export type DataTypeVertex = {
  kind: "dataType";
  inner: DataTypeWithMetadata;
};

export type PropertyTypeVertex = {
  kind: "propertyType";
  inner: PropertyTypeWithMetadata;
};

export type EntityTypeVertex = {
  kind: "entityType";
  inner: EntityTypeWithMetadata;
};

export type EntityVertex = { kind: "entity"; inner: Entity };

export type OntologyVertex =
  | DataTypeVertex
  | PropertyTypeVertex
  | EntityTypeVertex;

export type KnowledgeGraphVertex = EntityVertex;

export type Vertex = OntologyVertex | KnowledgeGraphVertex;

export const isDataTypeVertex = (vertex: Vertex): vertex is DataTypeVertex => {
  return vertex.kind === "dataType";
};

export const isPropertyTypeVertex = (
  vertex: Vertex,
): vertex is PropertyTypeVertex => {
  return vertex.kind === "propertyType";
};

export const isEntityTypeVertex = (
  vertex: Vertex,
): vertex is EntityTypeVertex => {
  return vertex.kind === "entityType";
};

export const isEntityVertex = (vertex: Vertex): vertex is EntityVertex => {
  return vertex.kind === "entity";
};

export type OntologyVertices = {
  [_: BaseUri]: {
    [_: number]: OntologyVertex;
  };
};

export type KnowledgeGraphVertices = {
  [_: EntityId]: {
    [_: EntityVersion]: KnowledgeGraphVertex;
  };
};

export type Vertices = OntologyVertices & KnowledgeGraphVertices;
