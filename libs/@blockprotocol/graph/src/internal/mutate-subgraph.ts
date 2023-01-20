import {
  Entity,
  EntityId,
  EntityVertex,
  KnowledgeGraphOutwardEdge,
  KnowledgeGraphRootedEdges,
  KnowledgeGraphVertices,
  Subgraph,
  Timestamp,
} from "../types.js";
import { isEqual } from "./mutate-subgraph/is-equal.js";

/**
 * Looking to build a subgraph? You probably want `import { buildSubgraph } from @blockprotocol/graph/stdlib`
 *
 * This MUTATES the given `Subgraph` by adding the given outwardEdge to the entity at the specified atTime.
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * @param subgraph – the subgraph to mutate by adding the outward edge
 * @param sourceEntityId – the id of the entity the edge is coming from
 * @param atTime – the time at which the edge should be recorded as being added at
 * @param outwardEdge – the edge itself
 */
export const addKnowledgeGraphEdgeToSubgraphByMutation = (
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
 * Looking to build a subgraph? You probably want `import { buildSubgraph } from @blockprotocol/graph/stdlib`
 *
 * This MUTATES the given `Subgraph` by adding the given outwardEdge to the entity at the specified atTime.
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * *Note*: This only adds edges as implied by the given entities, if the `Subgraph` is invalid at the time of method
 * call (e.g. by missing link endpoints), this will not loop through the vertex set to finish incomplete edges.
 *
 * @param subgraph – the subgraph to mutate by adding the provided entities
 * @param entities – the entity to add to the provided subgraph
 */
export const addEntitiesToSubgraphByMutation = (
  subgraph: Subgraph,
  entities: Entity[],
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  const linkMap: Record<
    EntityId,
    { leftEntityId: EntityId; rightEntityId: EntityId; earliestTime: Timestamp }
  > = {};

  for (const entity of entities) {
    const recordId = entity.metadata.recordId;
    if (entity.linkData) {
      const linkInfo = linkMap[recordId.entityId];
      if (!linkInfo) {
        linkMap[recordId.entityId] = {
          leftEntityId: entity.linkData.leftEntityId,
          rightEntityId: entity.linkData.rightEntityId,
          earliestTime: recordId.editionId,
        };
      } else if (recordId.editionId < linkInfo.earliestTime) {
        linkInfo.earliestTime = recordId.editionId;
      }
    }

    const entityVertex: EntityVertex = {
      kind: "entity",
      inner: entity,
    };

    if (!subgraph.vertices[recordId.entityId]) {
      // This is needed because ts can't differentiate between `EntityId` and `BaseUri`
      (subgraph.vertices as KnowledgeGraphVertices)[recordId.entityId] = {
        [recordId.editionId]: entityVertex,
      };
    } else {
      (subgraph.vertices as KnowledgeGraphVertices)[recordId.entityId]![
        recordId.editionId
      ] = entityVertex;
    }
  }

  for (const [
    linkEntityId,
    { leftEntityId, rightEntityId, earliestTime },
  ] of Object.entries(linkMap)) {
    addKnowledgeGraphEdgeToSubgraphByMutation(
      subgraph,
      linkEntityId,
      earliestTime,
      {
        kind: "HAS_LEFT_ENTITY",
        reversed: false,
        rightEndpoint: { baseId: leftEntityId, timestamp: earliestTime },
      },
    );
    addKnowledgeGraphEdgeToSubgraphByMutation(
      subgraph,
      leftEntityId,
      earliestTime,
      {
        kind: "HAS_LEFT_ENTITY",
        reversed: true,
        rightEndpoint: { baseId: linkEntityId, timestamp: earliestTime },
      },
    );
    addKnowledgeGraphEdgeToSubgraphByMutation(
      subgraph,
      linkEntityId,
      earliestTime,
      {
        kind: "HAS_RIGHT_ENTITY",
        reversed: false,
        rightEndpoint: { baseId: rightEntityId, timestamp: earliestTime },
      },
    );
    addKnowledgeGraphEdgeToSubgraphByMutation(
      subgraph,
      rightEntityId,
      earliestTime,
      {
        kind: "HAS_RIGHT_ENTITY",
        reversed: true,
        rightEndpoint: { baseId: linkEntityId, timestamp: earliestTime },
      },
    );
  }
  /* eslint-enable no-param-reassign */
};
