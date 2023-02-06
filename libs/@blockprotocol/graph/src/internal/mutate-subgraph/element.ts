import { unionOfIntervals } from "../../stdlib/interval.js";
import { Entity, EntityId } from "../../types/entity.js";
import {
  EntityIdWithInterval,
  EntityVertex,
  isTemporalSubgraph,
  KnowledgeGraphVertices,
  Subgraph,
} from "../../types/subgraph.js";
import { addOutwardEdgeToSubgraphByMutation } from "./edge.js";

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
 * @param {Entity[]} entities – the entities to add to the provided subgraph
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

    const entityInterval: EntityIdWithInterval["interval"] = isTemporalSubgraph(
      subgraph,
    )
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
          edgeIntervals: [entityInterval],
        };
      } else {
        linkInfo.edgeIntervals.push(entityInterval);
      }
    }

    const entityVertex: EntityVertex<Temporal> = {
      kind: "entity",
      inner: entity,
    };

    if (!subgraph.vertices[entityId]) {
      // This is needed because ts can't differentiate between `EntityId` and `BaseUri`
      (subgraph.vertices as KnowledgeGraphVertices<Temporal>)[entityId] = {
        [entityInterval.start.limit]: entityVertex,
      };
    } else {
      (subgraph.vertices as KnowledgeGraphVertices<Temporal>)[entityId]![
        entityInterval.start.limit
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
      addOutwardEdgeToSubgraphByMutation(
        subgraph,
        linkEntityId,
        edgeInterval.start.limit,
        {
          kind: "HAS_LEFT_ENTITY",
          reversed: false,
          rightEndpoint: { entityId: leftEntityId, interval: edgeInterval },
        },
      );
      addOutwardEdgeToSubgraphByMutation(
        subgraph,
        leftEntityId,
        edgeInterval.start.limit,
        {
          kind: "HAS_LEFT_ENTITY",
          reversed: true,
          rightEndpoint: { entityId: linkEntityId, interval: edgeInterval },
        },
      );
      addOutwardEdgeToSubgraphByMutation(
        subgraph,
        linkEntityId,
        edgeInterval.start.limit,
        {
          kind: "HAS_RIGHT_ENTITY",
          reversed: false,
          rightEndpoint: { entityId: rightEntityId, interval: edgeInterval },
        },
      );
      addOutwardEdgeToSubgraphByMutation(
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
