import { Entity, EntityId, EntityVersion } from "../../../types/entity";
import { Subgraph } from "../../../types/subgraph";
import { Timestamp } from "../../../types/subgraph/time";
import { isEntityVertex } from "../../../types/subgraph/vertices";

/**
 * Returns all `Entity`s within the vertices of the subgraph, optionally filtering to only get their latest editions.
 *
 * @param subgraph
 * @param latest - whether or not to only return the latest editions of each entity
 */
export const getEntities = (
  subgraph: Subgraph,
  latest: boolean = false,
): Entity[] => {
  return Object.values(
    Object.values(subgraph.vertices).flatMap((versionObject) => {
      const entityEditionVertices = latest
        ? Object.keys(versionObject)
            .sort()
            .slice(-1)
            .map((latestVersion) => versionObject[latestVersion]!)
            .filter(isEntityVertex)
        : Object.values(versionObject).filter(isEntityVertex);

      return entityEditionVertices.map((vertex) => vertex.inner);
    }),
  );
};

/**
 * Gets an `Entity` by its `EntityId` from within the vertices of the subgraph. If `targetEditionInformation` is not passed,
 * then the latest version of the `Entity` will be returned.
 *
 * Returns `undefined` if the entity couldn't be found.
 *
 * @param subgraph
 * @param {EntityId} entityId - The `EntityId` of the entity to get.
 * @param {EntityVersion|Timestamp} [targetEditionInformation] - Optional information needed to uniquely identify an edition of
 *     an entity either by an explicit `EntityVersion`, or by a given `Timestamp` where the entity whose lifespan
 *     overlaps the given timestamp will be returned.
 * @throws if the vertex isn't an `EntityVertex`
 */
export const getEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
  targetEditionInformation?: EntityVersion | Timestamp | Date,
): Entity | undefined => {
  const entityEditions = subgraph.vertices[entityId];

  if (entityEditions === undefined) {
    return undefined;
  }

  const editionVersions = Object.keys(entityEditions).sort();

  let entityEdition: Entity | undefined;

  // Short circuit for efficiency, just take the latest
  if (targetEditionInformation === undefined) {
    [entityEdition] = editionVersions
      .slice(-1)
      .map((latestVersion) => entityEditions[latestVersion]!.inner);
  } else {
    const targetTime =
      typeof targetEditionInformation === "string"
        ? targetEditionInformation
        : targetEditionInformation.toISOString();

    let targetVersion: EntityVersion | undefined;
    for (let idx = 0; idx < editionVersions.length; idx++) {
      /** @todo - If we expose endTimes we can do an interval check here per edition, rather than needing to infer it */
      // Rolling window: we've sorted, so for each edition's version check if the given timestamp is in between the
      // start of this edition and the next one (lower-bound-inclusive)
      const [editionVersion, nextEditionVersion] = editionVersions.slice(
        idx,
        idx + 1,
      ) as [EntityVersion, EntityVersion | undefined];

      // Last element in the array (latest version), so we assume an half-closed interval (unbounded on the upper-bound)
      if (nextEditionVersion === undefined) {
        if (editionVersion <= targetTime) {
          targetVersion = editionVersion;
        }
        break;
      } else if (
        editionVersion <= targetTime &&
        targetTime < nextEditionVersion
      ) {
        targetVersion = editionVersion;
        break;
      }
    }

    entityEdition =
      targetVersion !== undefined
        ? entityEditions[targetVersion]!.inner
        : undefined;
  }

  return entityEdition;
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
