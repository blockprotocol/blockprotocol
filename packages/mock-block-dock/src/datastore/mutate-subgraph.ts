import {
  Entity,
  EntityId,
  EntityVertex,
  KnowledgeGraphOutwardEdge,
  KnowledgeGraphRootedEdges,
  KnowledgeGraphVertices,
  Subgraph,
  Timestamp,
} from "@blockprotocol/graph";
import isEqual from "lodash/isEqual";

/** @todo - clean up the assertions here */
export const addKnowledgeGraphEdge = (
  subgraph: Subgraph,
  sourceEntityId: EntityId,
  atTime: Timestamp,
  outwardEdge: KnowledgeGraphOutwardEdge,
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  if (!subgraph.edges[sourceEntityId]) {
    // This is needed because ts can't differentiate between `EntityId` and `BaseUri`
    (subgraph.edges as KnowledgeGraphRootedEdges)[sourceEntityId] = {
      [atTime]: [outwardEdge],
    };
  } else if (!subgraph.edges[sourceEntityId]![atTime]) {
    subgraph.edges[sourceEntityId]![atTime] = [outwardEdge];
  } else {
    const outwardEdgesAtTime = subgraph.edges[sourceEntityId]![atTime]!;
    /**
     * @todo - Q for PR review: Added a lodash dependency for this, equality of the outward edge is actually complicated
     *    fine to keep?
     */
    if (
      !outwardEdgesAtTime.find((otherOutwardEdge) =>
        isEqual(otherOutwardEdge, outwardEdge),
      )
    ) {
      outwardEdgesAtTime.push(outwardEdge);
    }
  }

  /* eslint-enable no-param-reassign */
};

/**
 * Mutates the given `Subgraph` by adding the given entities into the `Vertices` object, creating edges as necessary.
 *
 * *Note*: This only adds edges as implied by the given entities, if the `Subgraph` is invalid at the time of method
 * call (e.g. by missing link endpoints), this will not loop through the vertex set to finish incomplete edges.
 *
 * @param subgraph
 * @param entities
 */
export const addEntitiesToSubgraph = (
  subgraph: Subgraph,
  entities: Entity[],
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  const linkMap: Record<
    EntityId,
    { leftEntityId: EntityId; rightEntityId: EntityId; earliestTime: Timestamp }
  > = {};

  for (const entity of entities) {
    const editionId = entity.metadata.editionId;
    if (entity.linkData) {
      const linkInfo = linkMap[editionId.baseId];
      if (!linkInfo) {
        linkMap[editionId.baseId] = {
          leftEntityId: entity.linkData.leftEntityId,
          rightEntityId: entity.linkData.rightEntityId,
          earliestTime: editionId.versionId,
        };
      } else if (editionId.versionId < linkInfo.earliestTime) {
        linkInfo.earliestTime = editionId.versionId;
      }
    }

    const entityVertex: EntityVertex = {
      kind: "entity",
      inner: entity,
    };

    if (!subgraph.vertices[editionId.baseId]) {
      // This is needed because ts can't differentiate between `EntityId` and `BaseUri`
      (subgraph.vertices as KnowledgeGraphVertices)[editionId.baseId] = {
        [editionId.versionId]: entityVertex,
      };
    } else {
      (subgraph.vertices as KnowledgeGraphVertices)[editionId.baseId]![
        editionId.versionId
      ] = entityVertex;
    }
  }

  for (const [
    linkEntityId,
    { leftEntityId, rightEntityId, earliestTime },
  ] of Object.entries(linkMap)) {
    addKnowledgeGraphEdge(subgraph, linkEntityId, earliestTime, {
      kind: "HAS_LEFT_ENTITY",
      reversed: false,
      rightEndpoint: { baseId: leftEntityId, timestamp: earliestTime },
    });
    addKnowledgeGraphEdge(subgraph, leftEntityId, earliestTime, {
      kind: "HAS_LEFT_ENTITY",
      reversed: true,
      rightEndpoint: { baseId: linkEntityId, timestamp: earliestTime },
    });
    addKnowledgeGraphEdge(subgraph, linkEntityId, earliestTime, {
      kind: "HAS_RIGHT_ENTITY",
      reversed: false,
      rightEndpoint: { baseId: rightEntityId, timestamp: earliestTime },
    });
    addKnowledgeGraphEdge(subgraph, rightEntityId, earliestTime, {
      kind: "HAS_RIGHT_ENTITY",
      reversed: true,
      rightEndpoint: { baseId: linkEntityId, timestamp: earliestTime },
    });
  }
  /* eslint-enable no-param-reassign */
};
