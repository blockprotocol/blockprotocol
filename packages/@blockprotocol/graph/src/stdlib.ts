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
import {
  Entity,
  EntityId,
  EntityPropertiesObject,
  WithSimpleAccessors,
} from "./types/entity.js";
import { LinkEntityAndRightEntity, Subgraph } from "./types/subgraph.js";

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
  LinkData extends LinkEntityAndRightEntity[] = LinkEntityAndRightEntity[],
>(
  subgraph: Subgraph,
  entityId: EntityId,
): LinkData =>
  getOutgoingLinkAndTargetEntitiesTemporal<LinkData>(subgraph, entityId);

/**
 * Adds simple property access to an entity, MUTATING the object passed in.
 * The simple accessors are the last path segment before the trailing slash of a base URI
 * e.g. if there is a key "https://example.com/my-type/" then a "my-type" key is added
 * @todo is this helper actually helpful, or should people just deal with accessing by URI?
 *    - they'll still have to deal with URIs, e.g. when sending updates
 */
export const addSimpleAccessors = <
  Properties extends EntityPropertiesObject = EntityPropertiesObject,
>(
  entity: Entity<Properties>,
) => {
  for (const [key, value] of Object.entries(entity.properties)) {
    const [simpleAccessor, trailingSpace] = key.split("/").slice(-2);
    if (trailingSpace !== "" || !simpleAccessor) {
      throw new Error(`Property key ${key} is not a valid base URI.`);
    }
    // eslint-disable-next-line no-param-reassign -- intentional mutation
    entity.properties[simpleAccessor] = value;
  }

  return entity as Entity<WithSimpleAccessors<Properties>>;
};
