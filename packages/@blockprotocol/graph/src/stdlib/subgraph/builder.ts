import { addEntitiesToSubgraphByMutation } from "../../internal/mutate-subgraph.js";
import {
  Entity,
  EntityEditionId,
  GraphResolveDepths,
  Subgraph,
} from "../../types.js";

/**
 * Builds a Subgraph from a given set of entities, some (or all) of which may be 'link entities' –
 * i.e. entities that represent relationships between other entities – or other entities.
 *
 * The set of entities should represent the result of a query on a graph,
 * and the 'roots' and 'depths' for that query provided along with the data.
 *
 * Unbounded queries can currently only be represented via very high values for depths.
 *
 * This function does NOT verify that the provided depths are accurate for the data.
 *   – the caller is responsible for this.
 * It DOES check that the provided roots are present in the data.
 *
 * @param data – the data to build the subgraph from (which becomes the vertices)
 * @param data.entities – the entities to build the subgraph from
 * @param depths – the depth values to provide in the returned subgraph
 * @param roots – the root values to provide in the returned subgraph
 *
 * @returns a Subgraph containing:
 *   - 'vertices' containing the provided entities
 *   - 'edges' calculated by the function, representing connections between vertices
 *   - 'depths' as provided by the caller
 *   - 'roots' as provided by the caller
 *
 * @throws if the provided roots are not present in the data
 *
 * @todo 1. add support for ontology vertices (e.g. entity types)
 * @todo 2. support null values for depths, for the result of queries with unlimited depths.
 */
export const buildSubgraph = (
  data: { entities: Entity[] },
  roots: EntityEditionId[],
  depths: GraphResolveDepths,
) => {
  const missingRoot = roots.find(
    ({ baseId, versionId }) =>
      !data.entities.find(
        (entity) =>
          entity.metadata.editionId.baseId === baseId &&
          entity.metadata.editionId.versionId === versionId,
      ),
  );

  if (missingRoot) {
    throw new Error(
      `Root not present in data: ${missingRoot.baseId} at version ${missingRoot.versionId}`,
    );
  }

  const subgraph: Subgraph = {
    roots,
    vertices: {},
    edges: {},
    depths,
  };

  addEntitiesToSubgraphByMutation(subgraph, data.entities);

  return subgraph;
};
