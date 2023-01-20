import {
  BaseUri,
  extractBaseUri,
  extractVersion,
  VersionedUri,
} from "@blockprotocol/type-system/slim";

import {
  isConstrainsPropertiesOnEdge,
  OntologyTypeVertexId,
  Subgraph,
} from "../../../types/subgraph.js";

/**
 * Gets identifiers for all `PropertyType`s referenced within a given `EntityType` schema by searching for
 * "ConstrainsPropertiesOn" `Edge`s from the respective `Vertex` within a `Subgraph`.
 *
 * @param subgraph {Subgraph} - The `Subgraph` containing the type tree of the `EntityType`
 * @param entityTypeId {OntologyTypeVertexId | VersionedUri} - The identifier of the `EntityType` to search for
 * @returns {OntologyTypeVertexId[]} - The identifiers of the `PropertyType`s referenced from the `EntityType`
 */
export const getPropertyTypesReferencedByEntityType = (
  subgraph: Subgraph,
  entityTypeId: OntologyTypeVertexId | VersionedUri,
): OntologyTypeVertexId[] => {
  let baseUri: BaseUri;
  let version: number;

  if (typeof entityTypeId === "string") {
    [baseUri, version] = [
      extractBaseUri(entityTypeId),
      extractVersion(entityTypeId),
    ];
  } else {
    baseUri = entityTypeId.baseId;
    version = entityTypeId.revisionId;
  }

  const outwardEdges = subgraph.edges[baseUri]?.[version];

  if (outwardEdges === undefined) {
    return [];
  }

  return outwardEdges
    .filter(isConstrainsPropertiesOnEdge)
    .map((outwardEdge) => outwardEdge.rightEndpoint);
};
