import { addEntitiesToSubgraphByMutation } from "../../internal/mutate-subgraph.js";
import {
  Entity,
  EntityRecordId,
  EntityRootType,
  GraphResolveDepths,
  ResolvedQueryTemporalAxes,
  Subgraph,
} from "../../types.js";

/**
 * Builds a {@link Subgraph} from a given {@link Entity} set, some (or all) of which may be 'link entities' –
 * i.e. entities that represent relationships between other entities – or other entities.
 *
 * The set of entities should represent the result of a query on a graph.
 * The 'roots' and 'depths' used for that query should be provided along with the data.
 *
 * The maximum value for any single depth is 255.
 *
 * This function does NOT verify that the provided depths are accurate for the data.
 * This function does NOT verify if provided temporal axes are accurate for the data.
 *   - the caller is responsible for both of the above.
 * It DOES check that the provided roots are present in the data.
 *
 * @param data – the data to build the subgraph from (which becomes the vertices)
 * @param data.entities – the entities to build the subgraph from
 * @param depths – the depth values to provide in the returned subgraph
 * @param rootRecordIds – the root values to provide in the returned subgraph
 * @param {ResolvedQueryTemporalAxes} temporalAxes - the temporal axes that were used when originally selecting the
 *   provided data
 *
 * @returns a Subgraph containing:
 *   - 'vertices' containing the provided entities
 *   - 'edges' calculated by the function, representing connections between vertices
 *   - 'depths' as provided by the caller
 *   - 'roots' as provided by the caller
 *   - 'temporalAxes' where both the `initial` and `resolved` are as provided by the caller
 *
 * @throws if the provided roots are not present in the data
 *
 * @todo add support for ontology vertices (e.g. entity types)
 */
export const buildSubgraph = <Temporal extends boolean>(
  data: { entities: Entity<Temporal>[] },
  rootRecordIds: EntityRecordId[],
  depths: GraphResolveDepths,
  temporalAxes: Temporal extends true ? ResolvedQueryTemporalAxes : undefined,
): Subgraph<Temporal, EntityRootType<Temporal>> => {
  const missingRoots = rootRecordIds.filter(
    ({ entityId, editionId }) =>
      !data.entities.find(
        (entity) =>
          entity.metadata.recordId.entityId === entityId &&
          entity.metadata.recordId.editionId === editionId,
      ),
  );

  if (missingRoots.length > 0) {
    throw new Error(
      `Root(s) not present in data: ${missingRoots
        .map(
          (missingRoot) =>
            `${missingRoot.entityId} at version ${missingRoot.editionId}`,
        )
        .join(", ")}`,
    );
  }

  const roots = rootRecordIds.map((rootRecordId) => ({
    baseId: rootRecordId.entityId,
    /** @todo - This is temporary, and wrong */
    revisionId: rootRecordId.editionId,
  }));

  // @ts-expect-error -- @todo, how do we convince TS that we're only setting this when the generic is satisfied
  const subgraph: Subgraph<Temporal, EntityRootType<Temporal>> = {
    roots,
    vertices: {},
    edges: {},
    depths,
    ...(temporalAxes !== undefined
      ? {
          temporalAxes: {
            initial: temporalAxes,
            resolved: temporalAxes,
          },
        }
      : {}),
  };

  addEntitiesToSubgraphByMutation(subgraph, data.entities);

  return subgraph;
};
