import { typedEntries } from "../../../../shared.js";
import {
  Entity,
  EntityId,
  LinkEntityAndRightEntity,
} from "../../../types/entity.js";
import {
  isHasLeftEntityEdge,
  isHasRightEntityEdge,
  isIncomingLinkEdge,
  isOutgoingLinkEdge,
  isTemporalSubgraph,
  Subgraph,
} from "../../../types/subgraph.js";
import { TimeInterval } from "../../../types/temporal-versioning.js";
import {
  intervalForTimestamp,
  intervalIntersectionWithInterval,
  intervalIsStrictlyAfterInterval,
} from "../../interval.js";
import { getEntityRevisionsByEntityId } from "../element/entity.js";
import { getLatestInstantIntervalForSubgraph } from "../temporal-axes.js";

const getUniqueEntitiesFilter = <Temporal extends boolean>() => {
  const set = new Set();
  return (entity: Entity<Temporal>) => {
    const recordIdString = JSON.stringify(entity.metadata.recordId);
    if (set.has(recordIdString)) {
      return false;
    } else {
      set.add(recordIdString);
      return true;
    }
  };
};

/**
 * Get all outgoing link entities from a given {@link Entity}.
 *
 * @param {Subgraph} subgraph
 * @param {EntityId} entityId - The ID of the source entity to search for outgoing links from
 * @param {TimeInterval} [interval] - An optional {@link TimeInterval} which, when provided with a
 *  {@link Subgraph} that supports temporal versioning, will constrain the results to links that were present during
 *  that interval. If the parameter is omitted then results will default to only returning results that are active in
 *  the latest instant of time in the {@link Subgraph}
 *
 * @returns {Entity[]} - A flat list of all {@link Entity}s associated with {@link OutgoingLinkEdge}s from the specified
 *   {@link Entity}. This list may contain multiple revisions of the same {@link Entity}s, and it might be beneficial to
 *   pair the output with {@link mapElementsIntoRevisions}.
 */
export const getOutgoingLinksForEntity = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  entityId: EntityId,
  interval?: Temporal extends true ? TimeInterval : undefined,
): Entity<Temporal>[] => {
  const searchInterval =
    interval !== undefined
      ? interval
      : getLatestInstantIntervalForSubgraph(subgraph);

  const entityEdges = subgraph.edges[entityId];

  if (!entityEdges) {
    return [];
  }

  const uniqueEntitiesFilter = getUniqueEntitiesFilter();

  const entities = [];

  for (const [edgeTimestamp, outwardEdges] of typedEntries(entityEdges)) {
    // Only look at outgoing edges that were created before or within the search interval
    if (
      !intervalIsStrictlyAfterInterval(
        intervalForTimestamp(edgeTimestamp),
        searchInterval,
      )
    ) {
      for (const outwardEdge of outwardEdges) {
        if (isOutgoingLinkEdge(outwardEdge)) {
          const { entityId: linkEntityId, interval: edgeInterval } =
            outwardEdge.rightEndpoint;

          if (isTemporalSubgraph(subgraph)) {
            // Find the revisions of the link at the intersection of the search interval and the edge's valid interval
            const intersection = intervalIntersectionWithInterval(
              searchInterval,
              edgeInterval,
            );

            if (intersection === null) {
              throw new Error(
                `No entity revision was found which overlapped the given edge, subgraph was likely malformed.\n` +
                  `EntityId: ${linkEntityId}\n` +
                  `Search Interval: ${JSON.stringify(searchInterval)}\n` +
                  `Edge Valid Interval: ${JSON.stringify(edgeInterval)}`,
              );
            }

            for (const entity of getEntityRevisionsByEntityId(
              subgraph as Subgraph<true>,
              linkEntityId,
              intersection,
            )) {
              if (uniqueEntitiesFilter(entity)) {
                entities.push(entity);
              }
            }
          } else {
            for (const entity of getEntityRevisionsByEntityId(
              subgraph,
              linkEntityId,
            )) {
              if (uniqueEntitiesFilter(entity)) {
                entities.push(entity);
              }
            }
          }
        }
      }
    }
  }

  return entities;
};

/**
 * Get all incoming link entities from a given {@link Entity}.
 *
 * @param {Subgraph} subgraph
 * @param {EntityId} entityId - The ID of the source entity to search for incoming links to
 * @param {TimeInterval} [interval] - An optional {@link TimeInterval} which, when provided with a
 *  {@link Subgraph} that supports temporal versioning, will constrain the results to links that were present during
 *  that interval. If the parameter is omitted then results will default to only returning results that are active in
 *  the latest instant of time in the {@link Subgraph}
 *
 * @returns {Entity[]} - A flat list of all {@link Entity}s associated with {@link IncomingLinkEdge}s from the specified
 *   {@link Entity}. This list may contain multiple revisions of the same {@link Entity}s, and it might be beneficial to
 *   pair the output with {@link mapElementsIntoRevisions}.
 */
export const getIncomingLinksForEntity = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  entityId: EntityId,
  interval?: Temporal extends true ? TimeInterval : undefined,
): Entity<Temporal>[] => {
  const searchInterval =
    interval !== undefined
      ? interval
      : getLatestInstantIntervalForSubgraph(subgraph);

  const entityEdges = subgraph.edges[entityId];

  if (!entityEdges) {
    return [];
  }

  const uniqueEntitiesFilter = getUniqueEntitiesFilter();

  const entities = [];

  for (const [edgeTimestamp, outwardEdges] of typedEntries(entityEdges)) {
    if (
      !intervalIsStrictlyAfterInterval(
        intervalForTimestamp(edgeTimestamp),
        searchInterval,
      )
    ) {
      for (const outwardEdge of outwardEdges) {
        if (isIncomingLinkEdge(outwardEdge)) {
          const { entityId: linkEntityId, interval: edgeInterval } =
            outwardEdge.rightEndpoint;

          if (isTemporalSubgraph(subgraph)) {
            // Find the revisions of the link at the intersection of the search interval and the edge's valid interval
            const intersection = intervalIntersectionWithInterval(
              searchInterval,
              edgeInterval,
            );

            if (intersection === null) {
              throw new Error(
                `No entity revision was found which overlapped the given edge, subgraph was likely malformed.\n` +
                  `EntityId: ${linkEntityId}\n` +
                  `Search Interval: ${JSON.stringify(searchInterval)}\n` +
                  `Edge Valid Interval: ${JSON.stringify(edgeInterval)}`,
              );
            }

            for (const entity of getEntityRevisionsByEntityId(
              subgraph as Subgraph<true>,
              linkEntityId,
              intersection,
            )) {
              if (uniqueEntitiesFilter(entity)) {
                entities.push(entity);
              }
            }
          } else {
            for (const entity of getEntityRevisionsByEntityId(
              subgraph,
              linkEntityId,
            )) {
              if (uniqueEntitiesFilter(entity)) {
                entities.push(entity);
              }
            }
          }
        }
      }
    }
  }

  return entities;
};

/**
 * Get the "left entity" revisions (by default this is the "source") of a given link entity.
 *
 * @param {Subgraph} subgraph
 * @param {EntityId} entityId - The ID of the link entity
 * @param {TimeInterval} [interval] - An optional {@link TimeInterval} which, when provided with a
 *  {@link Subgraph} that supports temporal versioning, will constrain the results to links that were present during
 *  that interval. If the parameter is omitted then results will default to only returning results that are active in
 *  the latest instant of time in the {@link Subgraph}
 *
 * @returns {Entity[] | undefined} - all revisions of the left {@link Entity} which was associated with a
 *   {@link HasLeftEntityEdge}, if found, from the given {@link EntityId} within the {@link Subgraph}, otherwise
 *   `undefined`.
 */
export const getLeftEntityForLinkEntity = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  entityId: EntityId,
  interval?: Temporal extends true ? TimeInterval : undefined,
): Entity<Temporal>[] | undefined => {
  const searchInterval =
    interval !== undefined
      ? interval
      : getLatestInstantIntervalForSubgraph(subgraph);

  const outwardEdge = Object.values(subgraph.edges[entityId] ?? {})
    .flat()
    .find(isHasLeftEntityEdge);

  if (!outwardEdge) {
    return undefined;
  }

  const leftEntityId = outwardEdge.rightEndpoint.entityId;

  if (isTemporalSubgraph(subgraph)) {
    const { interval: edgeInterval } = outwardEdge.rightEndpoint;
    const intersection = intervalIntersectionWithInterval(
      searchInterval,
      edgeInterval,
    );

    if (intersection === null) {
      throw new Error(
        `No entity revision was found which overlapped the given edge, subgraph was likely malformed.\n` +
          `EntityId: ${leftEntityId}\n` +
          `Search Interval: ${JSON.stringify(searchInterval)}\n` +
          `Edge Valid Interval: ${JSON.stringify(edgeInterval)}`,
      );
    }

    return getEntityRevisionsByEntityId(
      subgraph as Subgraph<true>,
      leftEntityId,
      intersection,
    ) as Entity<Temporal>[];
  } else {
    return getEntityRevisionsByEntityId(
      subgraph as Subgraph<false>,
      leftEntityId,
    ) as Entity<Temporal>[];
  }
};

/**
 * Get the "right entity" revisions (by default this is the "target") of a given link entity.
 *
 * @param {Subgraph} subgraph
 * @param {EntityId} entityId - The ID of the link entity
 * @param {TimeInterval} [interval] - An optional {@link TimeInterval} which, when provided with a
 *  {@link Subgraph} that supports temporal versioning, will constrain the results to links that were present during
 *  that interval. If the parameter is omitted then results will default to only returning results that are active in
 *  the latest instant of time in the {@link Subgraph}
 *
 * @returns {Entity[] | undefined} - all revisions of the right {@link Entity} which was associated with a
 *   {@link HasRightEntityEdge}, if found, from the given {@link EntityId} within the {@link Subgraph}, otherwise
 *   `undefined`.
 */
export const getRightEntityForLinkEntity = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  entityId: EntityId,
  interval?: Temporal extends true ? TimeInterval : undefined,
): Entity<Temporal>[] | undefined => {
  const searchInterval =
    interval !== undefined
      ? interval
      : getLatestInstantIntervalForSubgraph(subgraph);

  const outwardEdge = Object.values(subgraph.edges[entityId] ?? {})
    .flat()
    .find(isHasRightEntityEdge);

  if (!outwardEdge) {
    return undefined;
  }

  const rightEntityId = outwardEdge.rightEndpoint.entityId;

  if (isTemporalSubgraph(subgraph)) {
    const { interval: edgeInterval } = outwardEdge.rightEndpoint;
    const intersection = intervalIntersectionWithInterval(
      searchInterval,
      edgeInterval,
    );

    if (intersection === null) {
      throw new Error(
        `No entity revision was found which overlapped the given edge, subgraph was likely malformed.\n` +
          `EntityId: ${rightEntityId}\n` +
          `Search Interval: ${JSON.stringify(searchInterval)}\n` +
          `Edge Valid Interval: ${JSON.stringify(edgeInterval)}`,
      );
    }

    return getEntityRevisionsByEntityId(
      subgraph as Subgraph<true>,
      rightEntityId,
      intersection,
    ) as Entity<Temporal>[];
  } else {
    return getEntityRevisionsByEntityId(
      subgraph as Subgraph<false>,
      rightEntityId,
    ) as Entity<Temporal>[];
  }
};

/**
 * For a given {@link TimeInterval}, get all outgoing link {@link Entity} revisions, and their "target" {@link Entity}
 * revisions (by default this is the "right entity"), from a given {@link Entity}.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the source entity to search for outgoing links from
 * @param {TimeInterval} [interval] - An optional {@link TimeInterval} to constrain the period of time to search across.
 * If the parameter is omitted then results will default to only returning results that are active in the latest instant
 *   of time in the {@link Subgraph}
 */
export const getOutgoingLinkAndTargetEntities = <
  Temporal extends boolean,
  LinkAndRightEntities extends LinkEntityAndRightEntity<Temporal>[] = LinkEntityAndRightEntity<Temporal>[],
>(
  subgraph: Subgraph<Temporal>,
  entityId: EntityId,
  interval?: Temporal extends true ? TimeInterval : undefined,
): LinkAndRightEntities => {
  const searchInterval =
    interval ?? getLatestInstantIntervalForSubgraph(subgraph);

  if (isTemporalSubgraph(subgraph)) {
    const outgoingLinkEntities = getOutgoingLinksForEntity(
      subgraph as Subgraph<true>,
      entityId,
      searchInterval,
    );
    const mappedRevisions = outgoingLinkEntities.reduce(
      (revisionMap, entity) => {
        const linkEntityId = entity.metadata.recordId.entityId;

        // eslint-disable-next-line no-param-reassign
        revisionMap[linkEntityId] ??= [];
        revisionMap[linkEntityId]!.push(entity);

        return revisionMap;
      },
      {} as Record<EntityId, Entity<true>[]>,
    );

    return typedEntries(mappedRevisions).map(
      ([linkEntityId, linkEntityRevisions]) => {
        return {
          linkEntity: linkEntityRevisions,
          rightEntity: getRightEntityForLinkEntity(
            subgraph as Subgraph<true>,
            linkEntityId,
            searchInterval,
          ),
        };
      },
    ) as LinkAndRightEntities; // @todo consider fixing generics in functions called within
  } else {
    return getOutgoingLinksForEntity(subgraph as Subgraph<false>, entityId).map(
      (linkEntity) => {
        const rightEntityRevisions =
          getRightEntityForLinkEntity(
            subgraph as Subgraph<false>,
            linkEntity.metadata.recordId.entityId,
          ) ??
          []; /** @todo - Are we comfortable hiding the `undefined` value here with an empty array? */

        if (rightEntityRevisions.length !== 1) {
          throw new Error(
            `Querying a Subgraph without support for temporal versioning but there wasn't a unique revision for the right entity of the link entity with ID: ${linkEntity.metadata.recordId.entityId}`,
          );
        }

        return {
          linkEntity,
          rightEntity: rightEntityRevisions[0],
        };
      },
    ) as LinkAndRightEntities; // @todo consider fixing generics in functions called within
  }
};
