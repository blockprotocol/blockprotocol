import { VersionedUrl } from "@blockprotocol/type-system/slim";

import {
  isConstrainsLinkDestinationsOnEdge,
  isConstrainsLinksOnEdge,
  isConstrainsPropertiesOnEdge,
  isInheritsFromEdge,
  OntologyTypeVertexId,
  StrictOntologyOutwardEdge,
  Subgraph,
} from "../../../types/subgraph.js";
import { getOntologyTypesReferencedBy } from "./shared.js";

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
  getOntologyTypesReferencedBy(
    subgraph,
    entityTypeId,
    isConstrainsPropertiesOnEdge,
  );

/**
 * Gets identifiers for all `EntityType`s referenced within a given `EntityType` schema by searching for
 * "InheritsFrom", "ConstrainsLinksOn" and "ConstrainsLinkDestinationsOn" `Edge`s from the respective `Vertex` within a `Subgraph`.
 *
 * @param subgraph {Subgraph} - The `Subgraph` containing the type tree of the `EntityType`
 * @param entityTypeId {OntologyTypeVertexId | VersionedUrl} - The identifier of the `EntityType` to search for
 * @returns {OntologyTypeVertexId[]} - The identifiers of the `EntityType`s referenced from the `EntityType`
 */
export const getEntityTypesReferencedByEntityType = (
  subgraph: Subgraph<boolean>,
  entityTypeId: OntologyTypeVertexId | VersionedUrl,
): OntologyTypeVertexId[] =>
  getOntologyTypesReferencedBy(
    subgraph,
    entityTypeId,
    (outwardEdge): outwardEdge is StrictOntologyOutwardEdge =>
      isInheritsFromEdge(outwardEdge) ||
      isConstrainsLinksOnEdge(outwardEdge) ||
      isConstrainsLinkDestinationsOnEdge(outwardEdge),
  );
