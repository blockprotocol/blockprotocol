import {
  BaseUri,
  extractBaseUri,
  extractVersion,
  VersionedUri,
} from "@blockprotocol/type-system/slim";

import {
  isConstrainsPropertiesOnEdge,
  OntologyOutwardEdge,
  OntologyTypeRevisionId,
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
  subgraph: Subgraph<boolean>,
  entityTypeId: OntologyTypeVertexId | VersionedUri,
): OntologyTypeVertexId[] => {
  let baseUri: BaseUri;
  let revisionId: OntologyTypeRevisionId;

  if (typeof entityTypeId === "string") {
    baseUri = extractBaseUri(entityTypeId);
    revisionId = extractVersion(entityTypeId).toString();
  } else {
    baseUri = entityTypeId.baseId;
    revisionId = entityTypeId.revisionId;
  }

  const outwardEdges = subgraph.edges[baseUri]?.[
    revisionId
  ] as OntologyOutwardEdge<boolean>[];

  if (outwardEdges === undefined) {
    return [];
  }

  return outwardEdges
    .filter(isConstrainsPropertiesOnEdge)
    .map((outwardEdge) => outwardEdge.rightEndpoint);
};
