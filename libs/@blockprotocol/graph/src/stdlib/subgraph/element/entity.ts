import { Entity, EntityId, EntityVersion } from "../../../types/entity.js";
import { Subgraph } from "../../../types/subgraph.js";
import { Timestamp } from "../../../types/subgraph/time.js";
import { isEntityVertex } from "../../../types/subgraph/vertices.js";

/**
 * Returns all `Entity`s within the vertices of the subgraph, optionally filtering to only get their latest revisions.
 *
 * @param subgraph
 * @param latest - whether or not to only return the latest revisions of each entity
 */
export const getEntities = (
  subgraph: Subgraph,
  latest: boolean = false,
): Entity[] => {
  return Object.values(
    Object.values(subgraph.vertices).flatMap((versionObject) => {
      const entityRevisionVertices = latest
        ? Object.keys(versionObject)
            .sort()
            .slice(-1)
            .map((latestVersion) => versionObject[latestVersion]!)
            .filter(isEntityVertex)
        : Object.values(versionObject).filter(isEntityVertex);

      return entityRevisionVertices.map((vertex) => vertex.inner);
    }),
  );
};

/**
 * Gets an `Entity` by its `EntityId` from within the vertices of the subgraph. If `targetRevisionInformation` is not passed,
 * then the latest version of the `Entity` will be returned.
 *
 * Returns `undefined` if the entity couldn't be found.
 *
 * @param subgraph
 * @param {EntityId} entityId - The `EntityId` of the entity to get.
 * @param {EntityRevisionId|Timestamp} [targetRevisionInformation] - Optional information needed to uniquely identify an
 *     revision of an entity either by an explicit `EntityRevisionId`, or by a given `Timestamp` where the entity whose
 *     lifespan overlaps the given timestamp will be returned.
 * @throws if the vertex isn't an `EntityVertex`
 */
export const getEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
  targetRevisionInformation?: EntityVersion | Timestamp | Date,
): Entity | undefined => {
  const entityRevisions = subgraph.vertices[entityId];

  if (entityRevisions === undefined) {
    return undefined;
  }

  const revisionVersions = Object.keys(entityRevisions).sort();

  let entityRevision: Entity | undefined;

  // Short circuit for efficiency, just take the latest
  if (targetRevisionInformation === undefined) {
    [entityRevision] = revisionVersions
      .slice(-1)
      .map((latestVersion) => entityRevisions[latestVersion]!.inner);
  } else {
    const targetTime =
      typeof targetRevisionInformation === "string"
        ? targetRevisionInformation
        : targetRevisionInformation.toISOString();

    let targetVersion: EntityVersion | undefined;
    for (let idx = 0; idx < revisionVersions.length; idx++) {
      /** @todo - If we expose endTimes we can do an interval check here per revision, rather than needing to infer it */
      // Rolling window: we've sorted, so for each revision's version check if the given timestamp is in between the
      // start of this revision and the next one (lower-bound-inclusive)
      const [revisionVersion, nextRevisionVersion] = revisionVersions.slice(
        idx,
        idx + 1,
      ) as [EntityVersion, EntityVersion | undefined];

      // The list is sorted so if this is beyond the target time then all of the ones after are too
      if (revisionVersion > targetTime) {
        break;
      }

      // Last element in the array (latest version), so we assume an half-closed interval (unbounded on the upper-bound)
      if (nextRevisionVersion === undefined) {
        if (revisionVersion <= targetTime) {
          targetVersion = revisionVersion;
        }
        break;
      } else if (
        revisionVersion <= targetTime &&
        targetTime < nextRevisionVersion
      ) {
        targetVersion = revisionVersion;
        break;
      }
    }

    entityRevision =
      targetVersion !== undefined
        ? entityRevisions[targetVersion]!.inner
        : undefined;
  }

  return entityRevision;
};

/**
 * Returns all `Entity`s within the vertices of the subgraph that match a given `EntityId`
 *
 * @param subgraph
 * @param entityId
 */
export const getEntityRevisionsByEntityId = (
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
