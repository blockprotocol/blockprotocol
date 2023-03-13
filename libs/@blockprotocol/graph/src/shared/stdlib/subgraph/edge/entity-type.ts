import { VersionedUrl } from "@blockprotocol/type-system/slim";

import {
  isConstrainsLinkDestinationsOnEdge,
  isConstrainsLinksOnEdge,
  isConstrainsPropertiesOnEdge,
  isInheritsFromEdge,
  OntologyToOntologyOutwardEdge,
  OntologyTypeVertexId,
  Subgraph,
} from "../../../types/subgraph.js";
import { getOntologyEndpointsForOntologyOutwardEdge } from "./shared.js";

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
  getOntologyEndpointsForOntologyOutwardEdge(
    subgraph,
    entityTypeId,
    isConstrainsPropertiesOnEdge,
  );

/**
 * Gets identifiers for all `EntityType`s referenced within a given `EntityType` schema by searching for
 * "InheritsFrom" `Edge`s from the respective `Vertex` within a `Subgraph`.
 *
 * @param subgraph {Subgraph} - The `Subgraph` containing the type tree of the `EntityType`
 * @param entityTypeId {OntologyTypeVertexId | VersionedUrl} - The identifier of the `EntityType` to search for
 * @returns {OntologyTypeVertexId[]} - The identifiers of the `EntityType`s inherited from the `EntityType`
 */
export const getEntityTypesInheritedFromEntityType = (
  subgraph: Subgraph<boolean>,
  entityTypeId: OntologyTypeVertexId | VersionedUrl,
): OntologyTypeVertexId[] =>
  getOntologyEndpointsForOntologyOutwardEdge(
    subgraph,
    entityTypeId,
    (outwardEdge): outwardEdge is OntologyToOntologyOutwardEdge =>
      isInheritsFromEdge(outwardEdge),
  );

/**
 * Gets identifiers for all `EntityType`s referenced within a given `EntityType` schema by searching for
 * "ConstrainsLinksOn" `Edge`s from the respective `Vertex` within a `Subgraph`.
 *
 * @param subgraph {Subgraph} - The `Subgraph` containing the type tree of the `EntityType`
 * @param entityTypeId {OntologyTypeVertexId | VersionedUrl} - The identifier of the `EntityType` to search for
 * @returns {OntologyTypeVertexId[]} - The identifiers of the link `EntityType`s the `EntityType` constrains links on
 */
export const getLinkEntityTypeConstraintsFromEntityType = (
  subgraph: Subgraph<boolean>,
  entityTypeId: OntologyTypeVertexId | VersionedUrl,
): OntologyTypeVertexId[] =>
  getOntologyEndpointsForOntologyOutwardEdge(
    subgraph,
    entityTypeId,
    (outwardEdge): outwardEdge is OntologyToOntologyOutwardEdge =>
      isConstrainsLinksOnEdge(outwardEdge),
  );

/**
 * Gets identifiers for all `EntityType`s referenced within a given `EntityType` schema by searching for
 * "ConstrainsLinkDestinationsOn" `Edge`s from the respective `Vertex` within a `Subgraph`.
 *
 * @param subgraph {Subgraph} - The `Subgraph` containing the type tree of the `EntityType`
 * @param entityTypeId {OntologyTypeVertexId | VersionedUrl} - The identifier of the `EntityType` to search for
 * @returns {OntologyTypeVertexId[]} - The identifiers of the `EntityType`s the `EntityType` constrains link destinations on
 */
export const getEntityTypeLinkDestinationsFromEntityType = (
  subgraph: Subgraph<boolean>,
  entityTypeId: OntologyTypeVertexId | VersionedUrl,
): OntologyTypeVertexId[] =>
  getOntologyEndpointsForOntologyOutwardEdge(
    subgraph,
    entityTypeId,
    (outwardEdge): outwardEdge is OntologyToOntologyOutwardEdge =>
      isConstrainsLinkDestinationsOnEdge(outwardEdge),
  );
