import {
  BaseUri,
  extractBaseUri,
  extractVersion,
  VersionedUri,
} from "@blockprotocol/type-system/slim";

import { OntologyTypeRecordId } from "../../../types/ontology.js";
import { EntityTypeWithMetadata } from "../../../types/ontology/entity-type.js";
import { Subgraph } from "../../../types/subgraph.js";
import { isEntityTypeVertex } from "../../../types/subgraph/vertices.js";

/**
 * Returns all `EntityTypeWithMetadata`s within the vertices of the subgraph
 *
 * @param subgraph
 */
export const getEntityTypes = (
  subgraph: Subgraph,
): EntityTypeWithMetadata[] => {
  return Object.values(
    Object.values(subgraph.vertices).flatMap((versionObject) =>
      Object.values(versionObject)
        .filter(isEntityTypeVertex)
        .map((vertex) => vertex.inner),
    ),
  );
};

/**
 * Gets an `EntityTypeWithMetadata` by its `VersionedUri` from within the vertices of the subgraph. Returns `undefined`
 * if the entity type couldn't be found.
 *
 * @param subgraph
 * @param entityTypeId
 * @throws if the vertex isn't a `EntityTypeVertex`
 */
export const getEntityTypeById = (
  subgraph: Subgraph,
  entityTypeId: VersionedUri,
): EntityTypeWithMetadata | undefined => {
  const [baseUri, version] = [
    extractBaseUri(entityTypeId),
    extractVersion(entityTypeId),
  ];
  const vertex = subgraph.vertices[baseUri]?.[version];

  if (!vertex) {
    return undefined;
  }

  if (!isEntityTypeVertex(vertex)) {
    throw new Error(`expected entity type vertex but got: ${vertex.kind}`);
  }

  return vertex.inner;
};

/**
 * Gets a `EntityTypeWithMetadata` by its `OntologyTypeRecordId` from within the vertices of the subgraph. Returns
 * `undefined` if the entity type couldn't be found.
 *
 * @param subgraph
 * @param recordId
 * @throws if the vertex isn't a `EntityTypeVertex`
 */
export const getEntityTypeByRecordId = (
  subgraph: Subgraph,
  recordId: OntologyTypeRecordId,
): EntityTypeWithMetadata | undefined => {
  const vertex = subgraph.vertices[recordId.baseId]?.[recordId.versionId];

  if (!vertex) {
    return undefined;
  }

  if (!isEntityTypeVertex(vertex)) {
    throw new Error(`expected entity type vertex but got: ${vertex.kind}`);
  }

  return vertex.inner;
};

/**
 * Returns all `EntityTypeWithMetadata`s within the vertices of the subgraph that match a given `BaseUri`
 *
 * @param subgraph
 * @param baseUri
 */
export const getEntityTypesByBaseUri = (
  subgraph: Subgraph,
  baseUri: BaseUri,
): EntityTypeWithMetadata[] => {
  const versionObject = subgraph.vertices[baseUri];

  if (!versionObject) {
    return [];
  }
  const entityTypeVertices = Object.values(versionObject);

  return entityTypeVertices.map((vertex) => {
    if (!isEntityTypeVertex(vertex)) {
      throw new Error(`expected entity type vertex but got: ${vertex.kind}`);
    }

    return vertex.inner;
  });
};
