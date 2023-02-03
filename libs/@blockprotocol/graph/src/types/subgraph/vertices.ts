import { BaseUri, validateBaseUri } from "@blockprotocol/type-system/slim";

import {
  Entity,
  EntityId,
  EntityPropertiesObject,
  EntityPropertyValue,
  EntityRevisionId,
} from "../entity.js";
import { isOntologyTypeRecordId } from "../ontology.js";
import { DataTypeWithMetadata } from "../ontology/data-type.js";
import { EntityTypeWithMetadata } from "../ontology/entity-type.js";
import { PropertyTypeWithMetadata } from "../ontology/property-type.js";

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

export type EntityVertex<
  Temporal extends boolean,
  Properties extends EntityPropertiesObject | null = Record<
    BaseUri,
    EntityPropertyValue
  >,
> = { kind: "entity"; inner: Entity<Temporal, Properties> };

export type OntologyVertex =
  | DataTypeVertex
  | PropertyTypeVertex
  | EntityTypeVertex;

export type KnowledgeGraphVertex<
  Temporal extends boolean,
  Properties extends EntityPropertiesObject | null = Record<
    BaseUri,
    EntityPropertyValue
  >,
> = EntityVertex<Temporal, Properties>;

export type Vertex<
  Temporal extends boolean,
  Properties extends EntityPropertiesObject | null = Record<
    BaseUri,
    EntityPropertyValue
  >,
> = OntologyVertex | KnowledgeGraphVertex<Temporal, Properties>;

export const isDataTypeVertex = (
  vertex: Vertex<boolean>,
): vertex is DataTypeVertex => {
  return vertex.kind === "dataType";
};

export const isPropertyTypeVertex = (
  vertex: Vertex<boolean>,
): vertex is PropertyTypeVertex => {
  return vertex.kind === "propertyType";
};

export const isEntityTypeVertex = (
  vertex: Vertex<boolean>,
): vertex is EntityTypeVertex => {
  return vertex.kind === "entityType";
};

export const isEntityVertex = <Temporal extends boolean>(
  vertex: Vertex<Temporal>,
): vertex is EntityVertex<Temporal> => {
  return vertex.kind === "entity";
};

export type VertexId<BaseId, RevisionId> = {
  baseId: BaseId;
  revisionId: RevisionId;
};
export type EntityVertexId = VertexId<EntityId, EntityRevisionId>;
export type OntologyTypeVertexId = VertexId<BaseUri, number>;
export type GraphElementVertexId = EntityVertexId | OntologyTypeVertexId;

export const isOntologyTypeVertexId = (
  vertexId: unknown,
): vertexId is OntologyTypeVertexId => {
  return (
    vertexId != null &&
    typeof vertexId === "object" &&
    "baseId" in vertexId &&
    typeof vertexId.baseId === "string" &&
    /** @todo - This means we need to have initialized the type system */
    validateBaseUri(vertexId.baseId).type === "Ok" &&
    "revisionId" in vertexId &&
    typeof vertexId.revisionId === "number"
  );
};

export const isEntityVertexId = (
  vertexId: unknown,
): vertexId is EntityVertexId => {
  return (
    vertexId != null &&
    typeof vertexId === "object" &&
    "baseId" in vertexId &&
    "revisionId" in vertexId &&
    /** @todo - is it fine to just check that versionId is string, maybe timestamp if we want to lock it into being a
     *    timestamp?
     */
    !isOntologyTypeRecordId(vertexId)
  );
};

export type OntologyVertices = {
  [typeBaseUri: BaseUri]: {
    [typeVersion: number]: OntologyVertex;
  };
};

export type KnowledgeGraphVertices<Temporal extends boolean> = {
  [entityId: EntityId]: {
    [entityVersion: EntityRevisionId]: KnowledgeGraphVertex<Temporal>;
  };
};

export type Vertices<Temporal extends boolean> = OntologyVertices &
  KnowledgeGraphVertices<Temporal>;
