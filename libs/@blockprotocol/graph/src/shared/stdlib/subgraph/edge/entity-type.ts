import {
  BaseUrl,
  extractBaseUrl,
  extractVersion,
  VersionedUrl,
} from "@blockprotocol/type-system/slim";

import {
  isConstrainsPropertiesOnEdge,
  OntologyOutwardEdge,
  OntologyTypeRevisionId,
  OntologyTypeVertexId,
  OutwardEdge,
  StrictOntologyOutwardEdge,
  Subgraph,
} from "../../../types/subgraph.js";

// Helper higher-order function to simplify edge extraction
const getXTypesReferencedByYType = (
  subgraph: Subgraph<boolean>,
  entityTypeId: OntologyTypeVertexId | VersionedUrl,
  outwardEdgePredicate: (
    outwardEdge: OutwardEdge<boolean>,
  ) => outwardEdge is StrictOntologyOutwardEdge,
): OntologyTypeVertexId[] => {
  let baseUrl: BaseUrl;
  let revisionId: OntologyTypeRevisionId;

  if (typeof entityTypeId === "string") {
    baseUrl = extractBaseUrl(entityTypeId);
    revisionId = extractVersion(entityTypeId).toString();
  } else {
    baseUrl = entityTypeId.baseId;
    revisionId = entityTypeId.revisionId;
  }

  const outwardEdges = subgraph.edges[baseUrl]?.[
    revisionId
  ] as OntologyOutwardEdge<boolean>[];

  if (outwardEdges === undefined) {
    return [];
  }

  return outwardEdges
    .filter(outwardEdgePredicate)
    .map((outwardEdge) => outwardEdge.rightEndpoint);
};

/**
 * Gets identifiers for all `PropertyType`s referenced within a given `EntityType` schema by searching for
 * "ConstrainsPropertiesOn" `Edge`s from the respective `Vertex` within a `Subgraph`.
 *
 * @param subgraph {Subgraph} - The `Subgraph` containing the type tree of the `EntityType`
 * @param entityTypeId {OntologyTypeVertexId | VersionedUrl} - The identifier of the `EntityType` to search for
 * @returns {OntologyTypeVertexId[]} - The identifiers of the `PropertyType`s referenced from the `EntityType`
 */
export const getPropertyTypesReferencedByEntityType = (
  subgraph: Subgraph<boolean>,
  entityTypeId: OntologyTypeVertexId | VersionedUrl,
): OntologyTypeVertexId[] =>
  getXTypesReferencedByYType(
    subgraph,
    entityTypeId,
    isConstrainsPropertiesOnEdge,
  );
