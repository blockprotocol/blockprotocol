import {
  getEntities as getEntitiesTemporal,
  getEntity as getEntityTemporal,
} from "./stdlib/subgraph/element/entity";
import { EntityId } from "./types/entity";
import { Subgraph } from "./types/subgraph";

export {
  getDataTypeById,
  getDataTypes,
  getDataTypesByBaseUri,
} from "./stdlib/subgraph/element/data-type";
export {
  getEntityTypeById,
  getEntityTypes,
  getEntityTypesByBaseUri,
} from "./stdlib/subgraph/element/entity-type";
export {
  getPropertyTypeById,
  getPropertyTypes,
  getPropertyTypesByBaseUri,
} from "./stdlib/subgraph/element/property-type";

/**
 * Gets an `Entity` by its `EntityId` from within the vertices of the subgraph.
 *
 * Returns `undefined` if the entity couldn't be found.
 *
 * @param subgraph
 * @param {EntityId} entityId - The `EntityId` of the entity to get.
 * @throws if the vertex isn't an `EntityVertex`
 */
export const getEntity = (subgraph: Subgraph, entityId: EntityId) => {
  getEntityTemporal(subgraph, entityId);
};

/**
 * Returns all `Entity`s within the vertices of the subgraph, optionally filtering to only get their latest editions.
 *
 * @param subgraph
 * @param latest - whether or not to only return the latest editions of each entity
 */
export const getEntities = (subgraph: Subgraph) => {
  getEntitiesTemporal(subgraph, true);
};

/** @todo - Add stdlib methods around links */
