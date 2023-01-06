import { addEntitiesToSubgraphByMutation } from "../../internal/mutate-subgraph.js";
import { Entity, Subgraph } from "../../types.js";

/**
 * Builds a Subgraph from a given set of entities.
 * @param entities – the entities to build the subgraph from
 *
 * @todo add support for ontology vertices (e.g. entity types)
 */
export const buildSubgraph = ({ entities }: { entities: Entity[] }) => {
  const subgraph: Subgraph = {
    roots: [],
    vertices: {},
    edges: {},
    depths: {
      hasLeftEntity: { incoming: 255, outgoing: 255 },
      hasRightEntity: { incoming: 255, outgoing: 255 },
    },
  };

  addEntitiesToSubgraphByMutation(subgraph, entities);

  return subgraph;
};
