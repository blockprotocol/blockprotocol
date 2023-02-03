import { typedEntries } from "../../../shared.js";
import { Entity, EntityId, EntityRevisionId } from "../../../types/entity.js";
import { Subgraph } from "../../../types/subgraph.js";
import { isEntityVertex } from "../../../types/subgraph/vertices.js";
import { TimeInterval, Timestamp } from "../../../types/temporal-versioning.js";
import {
  intervalContainsTimestamp,
  intervalOverlapsInterval,
} from "../../interval.js";
import { mustBeDefined } from "../../must-be-defined.js";

/**
 * Returns all {@link Entity}s within the vertices of the given {@link Subgraph}, optionally filtering to only get their
 * latest revisions.
 *
 * @param subgraph
 * @param latest - whether or not to only return the latest revisions of each entity
 */
export const getEntities = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  latest: boolean = false,
): Entity<Temporal>[] => {
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
 * Gets an {@link Entity} by its {@link EntityId} from within the vertices of the subgraph. If
 * `targetRevisionInformation` is not passed, then the latest version of the {@link Entity} will be returned.
 *
 * Returns `undefined` if the entity couldn't be found.
 *
 * @param subgraph
 * @param {EntityId} entityId - The {@link EntityId} of the entity to get.
 * @param {EntityRevisionId|Timestamp|Date} [targetRevisionInformation] - Optional information needed to uniquely
 *     identify a revision of an entity either by an explicit {@link EntityRevisionId}, `Date`, or by a given
 *     {@link Timestamp} where the entity whose lifespan overlaps the given timestamp will be returned.
 * @throws if the vertex isn't an {@link EntityVertex}
 */
export const getEntityRevision = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  entityId: EntityId,
  targetRevisionInformation?: Temporal extends true
    ? EntityRevisionId | Timestamp | Date
    : undefined,
): Entity<Temporal> | undefined => {
  const entityRevisions = subgraph.vertices[entityId];

  if (entityRevisions === undefined) {
    return undefined;
  }

  const revisionVersions = Object.keys(entityRevisions).sort();

  // Short circuit for efficiency, just take the latest
  if (targetRevisionInformation === undefined) {
    return revisionVersions
      .slice(-1)
      .map((latestVersion) => entityRevisions[latestVersion]!.inner)
      .pop();
  } else {
    const targetTime =
      typeof targetRevisionInformation === "string"
        ? targetRevisionInformation
        : targetRevisionInformation.toISOString();

    for (const revisionTimestamp of revisionVersions) {
      const vertex = mustBeDefined(entityRevisions[revisionTimestamp]);

      if (!isEntityVertex(vertex)) {
        throw new Error(
          `Found non-entity vertex associated with EntityId: ${entityId}`,
        );
      }

      if (
        intervalContainsTimestamp(
          /*
         these casts are safe as we check for `targetRevisionInformation === undefined` above and that's only ever
         defined if `Temporal extends true`
         */
          (vertex.inner as Entity<true>).metadata.temporalVersioning[
            (subgraph as Subgraph<true>).temporalAxes.resolved.variable.axis
          ],
          targetTime,
        )
      ) {
        return vertex.inner;
      }
    }

    return undefined;
  }
};

/**
 * Returns all {@link Entity} revisions within the vertices of the subgraph that match a given {@link EntityId}.
 *
 * When querying a subgraph with support for temporal versioning, it optionally constrains the search to a given
 * {@link TimeInterval}.
 *
 * @param {Subgraph }subgraph
 * @param {EntityId} entityId
 * @param {TimeInterval} [interval]
 */
export const getEntityRevisionsByEntityId = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  entityId: EntityId,
  interval?: Temporal extends true ? TimeInterval : undefined,
): Entity<Temporal>[] => {
  const versionObject = subgraph.vertices[entityId];

  if (!versionObject) {
    return [];
  }

  if (interval !== undefined) {
    const filteredEntities = [];

    for (const [startTime, entityVertex] of typedEntries(versionObject)) {
      if (
        intervalContainsTimestamp(interval, startTime) &&
        isEntityVertex(entityVertex)
      ) {
        if (
          /*
           We want to find all entities which were active _at some point_ in the search interval. This is indicated by
           an overlap.
           */
          intervalOverlapsInterval(
            interval,
            /*
             these casts are safe as we check for `targetRevisionInformation === undefined` above and that's only ever
             defined if `Temporal extends true`
             */
            (entityVertex.inner as Entity<true>).metadata.temporalVersioning[
              (subgraph as Subgraph<true>).temporalAxes.resolved.variable.axis
            ],
          )
        ) {
          filteredEntities.push(entityVertex.inner);
        }
      }
    }

    return filteredEntities;
  } else {
    const entityVertices = Object.values(versionObject);
    return entityVertices.filter(isEntityVertex).map((vertex) => {
      return vertex.inner;
    });
  }
};
