import { Entity, EntityId } from "../../../types/entity";
import { OutwardEdge, Subgraph } from "../../../types/subgraph";
import {
  isHasLeftEntityEdge,
  isHasRightEntityEdge,
  isIncomingLinkEdge,
  isOutgoingLinkEdge,
  OutgoingLinkEdge,
} from "../../../types/subgraph/edges/outward-edge-alias";
import { mustBeDefined } from "../../must-be-defined";
import { getEntity } from "../element/entity";

const convertTimeToStringWithDefault = (
  timestamp?: Date | string,
  defaultConstructor = () => new Date().toISOString(),
) => {
  return timestamp === undefined
    ? defaultConstructor()
    : typeof timestamp === "string"
    ? timestamp
    : timestamp.toISOString();
};

const getUniqueEntitiesFilter = () => {
  const set = new Set();
  return (entity: Entity) => {
    const editionIdString = JSON.stringify(entity.metadata.editionId);
    if (set.has(editionIdString)) {
      return false;
    } else {
      set.add(editionIdString);
      return true;
    }
  };
};

/** @todo - Update these methods to take intervals instead of timestamps */

/**
 * For a given moment in time, get all outgoing link entities from a given entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the source entity to search for outgoing links from
 * @param {Date | string} [timestamp] - An optional `Date` or an ISO-formatted datetime string of the moment to search
 *    for, if not supplied it defaults to the current time
 */
export const getOutgoingLinksForEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
  timestamp?: Date | string,
): Entity[] => {
  const timestampString = convertTimeToStringWithDefault(timestamp);

  const entityEdges = subgraph.edges[entityId];

  if (!entityEdges) {
    return [];
  }

  const uniqueEntitiesFilter = getUniqueEntitiesFilter();

  return (
    Object.entries(entityEdges)
      // Only look at outgoing edges that were created before or at the timestamp
      .filter(([edgeTimestamp, _]) => edgeTimestamp <= timestampString)
      // Extract the link `EntityEditionId`s from the endpoints of the link edges
      .flatMap(([_, outwardEdges]) => {
        return (outwardEdges as OutwardEdge[])
          .filter(isOutgoingLinkEdge)
          .map((edge) => {
            return edge.rightEndpoint;
          });
      })
      .map(({ baseId: linkEntityId, timestamp: _firstEditionTimestamp }) => {
        return mustBeDefined(
          getEntity(
            subgraph,
            linkEntityId,
            // Find the edition of the link at the given moment (not at `_firstEditionTimestamp`, the start of its history)
            timestampString,
          ),
        );
      })
      .filter((x): x is Entity => x !== undefined)
      .filter(uniqueEntitiesFilter)
  );
};

/**
 * For a given moment in time, get all incoming link entities from a given entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the source entity to search for outgoing links from
 * @param {Date | string} [timestamp] - An optional `Date` or an ISO-formatted datetime string of the moment to search
 *    for, if not supplied it defaults to the current time
 */
export const getIncomingLinksForEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
  timestamp?: Date | string,
): Entity[] => {
  const timestampString = convertTimeToStringWithDefault(timestamp);

  const entityEdges = subgraph.edges[entityId];

  if (!entityEdges) {
    return [];
  }

  const uniqueEntitiesFilter = getUniqueEntitiesFilter();

  return (
    Object.entries(entityEdges)
      // Only look at edges that were created before or at the timestamp
      .filter(([edgeTimestamp, _]) => edgeTimestamp <= timestampString)
      // Extract the link `EntityEditionId`s from the endpoints of the link edges
      .flatMap(([_, outwardEdges]) => {
        return (outwardEdges as OutgoingLinkEdge[])
          .filter(isIncomingLinkEdge)
          .map((edge) => {
            return edge.rightEndpoint;
          });
      })
      .map(({ baseId: linkEntityId, timestamp: _firstEditionTimestamp }) => {
        return mustBeDefined(
          getEntity(
            subgraph,
            linkEntityId,
            // Find the edition of the link at the given moment (not at `_firstEditionTimestamp`, the start of its history)
            timestampString,
          ),
        );
      })
      .filter((x): x is Entity => x !== undefined)
      .filter(uniqueEntitiesFilter)
  );
};

/**
 * For a given moment in time, get the "left entity" (by default this is the "source") of a given link entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the link entity
 * @param {Date | string} [timestamp] - An optional `Date` or an ISO-formatted datetime string of the moment to search
 *    for, if not supplied it defaults to the current time
 */
export const getLeftEntityForLinkEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
  timestamp?: Date | string,
): Entity => {
  const linkEntityEdges = mustBeDefined(
    subgraph.edges[entityId],
    "link entities must have left endpoints and therefore must have edges",
  );

  const endpointEntityId = mustBeDefined(
    Object.values(linkEntityEdges).flat().find(isHasLeftEntityEdge)
      ?.rightEndpoint.baseId,
    "link entities must have left endpoints",
  );

  return mustBeDefined(
    getEntity(subgraph, endpointEntityId, timestamp),
    "all edge endpoints should have a corresponding vertex",
  );
};

/**
 * For a given moment in time, get the "right entity" (by default this is the "destination") of a given link entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the link entity
 * @param {Date | string} [timestamp] - An optional `Date` or an ISO-formatted datetime string of the moment to search
 *    for, if not supplied it defaults to the current time
 */
export const getRightEntityForLinkEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
  timestamp?: Date | string,
): Entity => {
  const linkEntityEdges = mustBeDefined(
    subgraph.edges[entityId],
    "link entities must have right endpoints and therefore must have edges",
  );

  const endpointEntityId = mustBeDefined(
    Object.values(linkEntityEdges).flat().find(isHasRightEntityEdge)
      ?.rightEndpoint.baseId,
    "link entities must have right endpoints",
  );

  return mustBeDefined(
    getEntity(subgraph, endpointEntityId, timestamp),
    "all edge endpoints should have a corresponding vertex",
  );
};

/**
 * For a given moment in time, get all outgoing link entities, and their right entities, from a given entity.
 *
 * @param subgraph
 * @param {EntityId} entityId - The ID of the source entity to search for outgoing links from
 * @param {Date | string} [timestamp] - An optional `Date` or an ISO-formatted datetime string of the moment to search
 *    for, if not supplied it defaults to the current time
 */
export const getOutgoingLinkAndTargetEntities = (
  subgraph: Subgraph,
  entityId: EntityId,
  timestamp?: Date | string,
): { linkEntity: Entity; rightEntity: Entity }[] => {
  return getOutgoingLinksForEntity(subgraph, entityId, timestamp).map(
    (linkEntity) => {
      return {
        linkEntity,
        rightEntity: getRightEntityForLinkEntity(
          subgraph,
          linkEntity.metadata.editionId.baseId,
          timestamp,
        ),
      };
    },
  );
};
