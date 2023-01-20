import { addEntitiesToSubgraphByMutation } from "../../internal/mutate-subgraph.js";
import {
  Entity,
  EntityRecordId,
  GraphResolveDepths,
  Subgraph,
} from "../../types.js";

/**
 * Builds a Subgraph from a given set of entities, some (or all) of which may be 'link entities' –
 * i.e. entities that represent relationships between other entities – or other entities.
 *
 * The set of entities should represent the result of a query on a graph.
 * The 'roots' and 'depths' used for that query should be provided along with the data.
 *
 * The maximum value for any single depth is 255.
 *
 * This function does NOT verify that the provided depths are accurate for the data.
 *   – the caller is responsible for this.
 * It DOES check that the provided roots are present in the data.
 *
 * @param data – the data to build the subgraph from (which becomes the vertices)
 * @param data.entities – the entities to build the subgraph from
 * @param depths – the depth values to provide in the returned subgraph
 * @param rootRecordIds – the root values to provide in the returned subgraph
 *
 * @returns a Subgraph containing:
 *   - 'vertices' containing the provided entities
 *   - 'edges' calculated by the function, representing connections between vertices
 *   - 'depths' as provided by the caller
 *   - 'roots' as provided by the caller
 *
 * @throws if the provided roots are not present in the data
 *
 * @todo add support for ontology vertices (e.g. entity types)
 */
export const buildSubgraph = (
  data: { entities: Entity[] },
  rootRecordIds: EntityRecordId[],
  depths: GraphResolveDepths,
) => {
  const missingRoots = rootRecordIds.filter(
    ({ baseId, versionId }) =>
      !data.entities.find(
        (entity) =>
          entity.metadata.recordId.baseId === baseId &&
          entity.metadata.recordId.versionId === versionId,
      ),
  );

  if (missingRoots.length > 0) {
    throw new Error(
      `Root(s) not present in data: ${missingRoots
        .map(
          (missingRoot) =>
            `${missingRoot.baseId} at version ${missingRoot.versionId}`,
        )
        .join(", ")}`,
    );
  }

  const roots = rootRecordIds.map((rootRecordId) => ({
    baseId: rootRecordId.baseId,
    /** @todo - This is temporary, and wrong */
    revisionId: rootRecordId.versionId,
  }));

  const subgraph: Subgraph = {
    roots,
    vertices: {},
    edges: {},
    depths,
  };

  addEntitiesToSubgraphByMutation(subgraph, data.entities);

  return subgraph;
};
