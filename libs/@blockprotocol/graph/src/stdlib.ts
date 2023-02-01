/**
 * The base standard library of functions for interacting with a `Subgraph`.
 */
import {
  getIncomingLinksForEntity as getIncomingLinksForEntityTemporal,
  getLeftEntityForLinkEntity as getLeftEntityForLinkEntityTemporal,
  getOutgoingLinkAndTargetEntities as getOutgoingLinkAndTargetEntitiesTemporal,
  getOutgoingLinksForEntity as getOutgoingLinksForEntityTemporal,
  getRightEntityForLinkEntity as getRightEntityForLinkEntityTemporal,
} from "./stdlib/subgraph/edge/link-entity.js";
import {
  getEntities as getEntitiesTemporal,
  getEntity as getEntityTemporal,
} from "./stdlib/subgraph/element/entity.js";
import { Entity, EntityId, LinkEntityAndRightEntity } from "./types/entity.js";
import { Subgraph } from "./types/subgraph.js";

export { buildSubgraph } from "./stdlib/subgraph/builder.js";
export {
  getDataTypeById,
  getDataTypes,
  getDataTypesByBaseUri,
} from "./stdlib/subgraph/element/data-type.js";
export {
  getEntityTypeById,
  getEntityTypes,
  getEntityTypesByBaseUri,
} from "./stdlib/subgraph/element/entity-type.js";
export {
  getPropertyTypeById,
  getPropertyTypes,
  getPropertyTypesByBaseUri,
} from "./stdlib/subgraph/element/property-type.js";
export { getRoots } from "./stdlib/subgraph/roots.js";

/**
 * Gets an `Entity` by its `EntityId` from within the vertices of the subgraph.
 *
 * Returns `undefined` if the entity couldn't be found.
 *
 * @param subgraph
 * @param {EntityId} entityId - The `EntityId` of the entity to get.
 * @throws if the vertex isn't an `EntityVertex`
 */
export const getEntity = (subgraph: Subgraph, entityId: EntityId) =>
  getEntityTemporal(subgraph, entityId);

/**
 * Returns all `Entity`s within the vertices of the subgraph.
 *
 * @param subgraph
 */
export const getEntities = (subgraph: Subgraph) =>
  getEntitiesTemporal(subgraph, true);

/**
 * Gets all outgoing link entities from a given entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the source entity to search for outgoing links from
 */
export const getOutgoingLinksForEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
): Entity[] => getOutgoingLinksForEntityTemporal(subgraph, entityId);

/**
 * Gets all incoming link entities from a given entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the source entity to search for incoming links to
 */
export const getIncomingLinksForEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
): Entity[] => getIncomingLinksForEntityTemporal(subgraph, entityId);

/**
 * Gets the "left entity" (by default this is the "source") of a given link entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the link entity
 */
export const getLeftEntityForLinkEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
): Entity => getLeftEntityForLinkEntityTemporal(subgraph, entityId);

/**
 * Gets the "right entity" (by default this is the "target") of a given link entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the link entity
 */
export const getRightEntityForLinkEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
): Entity => getRightEntityForLinkEntityTemporal(subgraph, entityId);

/**
 * Gets all outgoing link entities, and their "target" entities (by default this is the "right entity"), from a given
 * entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the source entity to search for outgoing links from
 */
export const getOutgoingLinkAndTargetEntities = <
  LinkAndRightEntities extends LinkEntityAndRightEntity[] = LinkEntityAndRightEntity[],
>(
  subgraph: Subgraph,
  entityId: EntityId,
): LinkAndRightEntities =>
  getOutgoingLinkAndTargetEntitiesTemporal<LinkAndRightEntities>(
    subgraph,
    entityId,
  );
