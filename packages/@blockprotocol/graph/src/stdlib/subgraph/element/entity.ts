import { Entity, EntityEditionId, EntityId } from "../../../types/entity";
import { Subgraph } from "../../../types/subgraph";
import { isEntityVertex } from "../../../types/subgraph/vertices";

/**
 * Returns all `Entity`s within the vertices of the subgraph
 *
 * @param subgraph
 */
export const getEntities = (subgraph: Subgraph): Entity[] => {
  return Object.values(
    Object.values(subgraph.vertices).flatMap((versionObject) =>
      Object.values(versionObject)
        .filter(isEntityVertex)
        .map((vertex) => vertex.inner),
    ),
  );
};

/**
 * Gets an `Entity` by its `EntityEditionId` from within the vertices of the subgraph. Returns `undefined`
 * if the entity couldn't be found.
 *
 * @param subgraph
 * @param entityEditionId
 * @throws if the vertex isn't an `EntityVertex`
 */
export const getEntityByEditionId = (
  subgraph: Subgraph,
  entityEditionId: EntityEditionId,
): Entity | undefined => {
  const { baseId: entityId, versionId } = entityEditionId;
  const vertex = subgraph.vertices[entityId]?.[versionId];

  if (!vertex) {
    return undefined;
  }

  return vertex.inner;
};

/**
 * Returns all `Entity`s within the vertices of the subgraph that match a given `EntityId`
 *
 * @param subgraph
 * @param entityId
 */
export const getEntityEditionsByEntityId = (
  subgraph: Subgraph,
  entityId: EntityId,
): Entity[] => {
  const versionObject = subgraph.vertices[entityId];

  if (!versionObject) {
    return [];
  }
  const entityVertices = Object.values(versionObject);

  return entityVertices.filter(isEntityVertex).map((vertex) => {
    return vertex.inner;
  });
};
