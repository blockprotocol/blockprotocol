import { unionOfIntervals } from "../stdlib/interval.js";
import {
  Entity,
  EntityId,
  EntityIdWithInterval,
  EntityVertex,
  isTemporalSubgraph,
  KnowledgeGraphOutwardEdge,
  KnowledgeGraphRootedEdges,
  KnowledgeGraphVertices,
  OutwardEdge,
  Subgraph,
  Timestamp,
} from "../types.js";
import { isEqual } from "./mutate-subgraph/is-equal.js";

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph}  by adding the given outwardEdge to the entity at the specified atTime.
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the outward edge
 * @param {EntityId} sourceEntityId – the id of the entity the edge is coming from
 * @param {Timestamp} atTime – the time at which the edge should be recorded as being added at
 * @param {KnowledgeGraphOutwardEdge} outwardEdge – the edge itself
 */
export const addKnowledgeGraphEdgeToSubgraphByMutation = <
  Temporal extends boolean,
>(
  subgraph: Subgraph<Temporal>,
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
    const outwardEdgesAtTime = subgraph.edges[sourceEntityId]![
      atTime
    ]! as KnowledgeGraphOutwardEdge[];
    if (
      !outwardEdgesAtTime.find((otherOutwardEdge: OutwardEdge) =>
        isEqual(otherOutwardEdge, outwardEdge),
      )
    ) {
      outwardEdgesAtTime.push(outwardEdge);
    }
  }

  /* eslint-enable no-param-reassign */
};

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph} by adding a given list of entities to the vertices, creating any link edges
 * that are **directly implied** by any link entities in the list (see note below).
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * *Note*: This only adds edges as implied by the given entities, if the {@link Subgraph} is invalid at the time of
 * method call (e.g. by missing link endpoints), this will not loop through the vertex set to finish incomplete edges.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the provided entities
 * @param {Entity[]} entities – the entity to add to the provided subgraph
 */
export const addEntitiesToSubgraphByMutation = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  entities: Entity<Temporal>[],
) => {
  /*
   * @todo This assumes that the left and right entity ID of a link entity is static for its entire lifetime, that is
   *   not necessarily going to continue being the case
   */
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  const linkMap: Record<
    EntityId,
    {
      leftEntityId: EntityId;
      rightEntityId: EntityId;
      edgeIntervals: EntityIdWithInterval["interval"][];
    }
  > = {};

  for (const entity of entities) {
    const entityId = entity.metadata.recordId.entityId;

    const entityRevisionValidInterval: EntityIdWithInterval["interval"] =
      isTemporalSubgraph(subgraph)
        ? /*
         these casts should be safe as we have just checked if the Subgraph has temporal information, in which case the
         entities should too
         */
          (entity as Entity<true>).metadata.temporalVersioning[
            subgraph.temporalAxes.resolved.variable.axis
          ]
        : {
            start: { kind: "inclusive", limit: new Date(0).toISOString() },
            end: { kind: "unbounded" },
          };

    if (entity.linkData) {
      const linkInfo = linkMap[entityId];
      if (!linkInfo) {
        linkMap[entityId] = {
          leftEntityId: entity.linkData.leftEntityId,
          rightEntityId: entity.linkData.rightEntityId,
          edgeIntervals: [entityRevisionValidInterval],
        };
      } else {
        linkInfo.edgeIntervals.push(entityRevisionValidInterval);
      }
    }

    const entityVertex: EntityVertex<Temporal> = {
      kind: "entity",
      inner: entity,
    };

    if (!subgraph.vertices[entityId]) {
      // This is needed because ts can't differentiate between `EntityId` and `BaseUri`
      (subgraph.vertices as KnowledgeGraphVertices<Temporal>)[entityId] = {
        [entityRevisionValidInterval.start.limit]: entityVertex,
      };
    } else {
      (subgraph.vertices as KnowledgeGraphVertices<Temporal>)[entityId]![
        entityRevisionValidInterval.start.limit
      ] = entityVertex;
    }
  }

  for (const [
    linkEntityId,
    { leftEntityId, rightEntityId, edgeIntervals },
  ] of Object.entries(linkMap)) {
    // If the list of entities is comprehensive, and link destinations cannot change, the result of this should be an
    // array with a single interval that spans the full lifespan of the link entity.
    const unionedIntervals = unionOfIntervals(...edgeIntervals);

    for (const edgeInterval of unionedIntervals) {
      addKnowledgeGraphEdgeToSubgraphByMutation(
        subgraph,
        linkEntityId,
        edgeInterval.start.limit,
        {
          kind: "HAS_LEFT_ENTITY",
          reversed: false,
          rightEndpoint: { entityId: leftEntityId, interval: edgeInterval },
        },
      );
      addKnowledgeGraphEdgeToSubgraphByMutation(
        subgraph,
        leftEntityId,
        edgeInterval.start.limit,
        {
          kind: "HAS_LEFT_ENTITY",
          reversed: true,
          rightEndpoint: { entityId: linkEntityId, interval: edgeInterval },
        },
      );
      addKnowledgeGraphEdgeToSubgraphByMutation(
        subgraph,
        linkEntityId,
        edgeInterval.start.limit,
        {
          kind: "HAS_RIGHT_ENTITY",
          reversed: false,
          rightEndpoint: { entityId: rightEntityId, interval: edgeInterval },
        },
      );
      addKnowledgeGraphEdgeToSubgraphByMutation(
        subgraph,
        rightEntityId,
        edgeInterval.start.limit,
        {
          kind: "HAS_RIGHT_ENTITY",
          reversed: true,
          rightEndpoint: { entityId: linkEntityId, interval: edgeInterval },
        },
      );
    }
  }
  /* eslint-enable no-param-reassign */
};
