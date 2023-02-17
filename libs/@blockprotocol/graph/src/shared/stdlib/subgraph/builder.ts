import {
  addDataTypesToSubgraphByMutation,
  addEntitiesToSubgraphByMutation,
  addEntityTypesToSubgraphByMutation,
  addPropertyTypesToSubgraphByMutation,
} from "../../../internal/mutate-subgraph/element.js";
import {
  DataTypeWithMetadata,
  Entity,
  EntityRootType,
  EntityTypeWithMetadata,
  GraphElementVertexId,
  GraphResolveDepths,
  PropertyTypeWithMetadata,
  Subgraph,
  SubgraphTemporalAxes,
} from "../../types.js";

/**
 * Builds a {@link Subgraph} from a given set of graph elements.
 *
 * The sets of elements should represent the result of a query on a graph.
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
 * @param data.dataTypes – the data types to include in the subgraph
 * @param data.propertyTypes – the property types to include in the subgraph
 * @param data.entityTypes – the entity types to include in the subgraph
 * @param data.entities – the entities to include in the subgraph
 * @param depths – the depth values to provide in the returned subgraph
 * @param rootVertexIds – the vertexIds of the root elements to provide in the returned subgraph
 * @param {SubgraphTemporalAxes} subgraphTemporalAxes - the sets of temporal axes that were used when originally
 * selecting the provided data
 *
 * @returns a Subgraph containing:
 *   - 'vertices' containing the provided entities
 *   - 'edges' calculated by the function, representing connections between vertices
 *   - 'depths' as provided by the caller
 *   - 'roots' as provided by the caller
 *   - 'temporalAxes' where both the `initial` and `resolved` are as provided by the caller
 *
 * @throws if the provided roots are not present in the data
 */
export const buildSubgraph = <Temporal extends boolean>(
  data: {
    entities: Entity<Temporal>[];
    entityTypes: EntityTypeWithMetadata[];
    propertyTypes: PropertyTypeWithMetadata[];
    dataTypes: DataTypeWithMetadata[];
  },
  rootVertexIds: GraphElementVertexId[],
  depths: GraphResolveDepths,
  subgraphTemporalAxes: Temporal extends true
    ? SubgraphTemporalAxes
    : undefined,
): Subgraph<Temporal, EntityRootType<Temporal>> => {
  const isTemporal = subgraphTemporalAxes !== undefined;

  const missingRoots = rootVertexIds.filter(
    ({ baseId, revisionId }) =>
      !(
        data.entities.find(
          (entity) =>
            entity.metadata.recordId.entityId === baseId &&
            (isTemporal
              ? (entity as Entity<true>).metadata.temporalVersioning[
                  subgraphTemporalAxes.resolved.variable.axis
                ].start.limit === revisionId
              : true),
        ) ||
        [...data.dataTypes, ...data.propertyTypes, ...data.entityTypes].find(
          (ontologyType) =>
            ontologyType.metadata.recordId.baseUri === baseId &&
            `${ontologyType.metadata.recordId.version}` === revisionId,
        )
      ),
  );

  if (missingRoots.length > 0) {
    throw new Error(
      `Root(s) not present in data: ${missingRoots
        .map(
          (missingRoot) =>
            `${missingRoot.baseId} with revisionId: ${missingRoot.revisionId}`,
        )
        .join(", ")}`,
    );
  }

  // @ts-expect-error -- @todo, how do we convince TS that we're only setting this when the generic is satisfied
  const subgraph: Subgraph<Temporal, EntityRootType<Temporal>> = {
    roots: rootVertexIds,
    vertices: {},
    edges: {},
    depths,
    ...(subgraphTemporalAxes !== undefined
      ? {
          temporalAxes: subgraphTemporalAxes,
        }
      : {}),
  };

  addDataTypesToSubgraphByMutation(subgraph, data.dataTypes);
  addPropertyTypesToSubgraphByMutation(subgraph, data.propertyTypes);
  addEntityTypesToSubgraphByMutation(subgraph, data.entityTypes);
  addEntitiesToSubgraphByMutation(subgraph, data.entities);

  return subgraph;
};
