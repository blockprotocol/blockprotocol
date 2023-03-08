import {
  BaseUrl,
  extractBaseUrl,
  extractVersion,
  getReferencedIdsFromPropertyType,
} from "@blockprotocol/type-system/slim";

import { EntityId } from "../../shared/types/entity.js";
import {
  isPropertyTypeVertex,
  OntologyTypeRevisionId,
  OntologyTypeVertexId,
  OutwardEdge,
  Subgraph,
} from "../../shared/types/subgraph.js";
import { Timestamp } from "../../shared/types/temporal-versioning.js";
import { isEqual } from "./is-equal.js";

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph}  by adding the given {@link OutwardEdge} to `edges` object from the
 * given element at the specified point.
 *
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the outward edge
 * @param {EntityId | BaseUrl} sourceBaseId – the id of the element the edge is coming from
 * @param {string} at – the identifier for the revision, or the timestamp, at which the edge was added
 * @param {OutwardEdge} outwardEdge – the edge itself
 */
export const addOutwardEdgeToSubgraphByMutation = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  sourceBaseId: EntityId | BaseUrl,
  at: OntologyTypeRevisionId | Timestamp,
  outwardEdge: OutwardEdge<Temporal>,
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  subgraph.edges[sourceBaseId] ??= {};
  subgraph.edges[sourceBaseId]![at] ??= [];
  const outwardEdgesAtVersion: OutwardEdge<Temporal>[] =
    subgraph.edges[sourceBaseId]![at]!;

  if (
    !outwardEdgesAtVersion.find((otherOutwardEdge: OutwardEdge<Temporal>) =>
      isEqual(otherOutwardEdge, outwardEdge),
    )
  ) {
    outwardEdgesAtVersion.push(outwardEdge);
  }
  /* eslint-enable no-param-reassign */
};

/**
 * @todo - with the introduction of non-primitive data types edges will need to be added here
 *
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph} by creating any ontology related edges that are **directly implied** by the given data type ids (see note below).
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * *Note*: This only adds edges as implied by the given data types, if the {@link Subgraph} is invalid at the time of
 * method call (e.g. by missing data type endpoints), this will not loop through the vertex set to finish incomplete
 * edges.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding edges
 * @param {OntologyTypeVertexId[]} dataTypeVertexIds - the IDs of the data types to resolve edges for
 */
export const resolveDataTypeEdgesToSubgraphByMutation = (
  _subgraph: Subgraph<boolean>,
  _dataTypeVertexIds: OntologyTypeVertexId[],
) => {};

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph} by creating any ontology related edges that are **directly implied** by them (see note below).
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * *Note*: This only adds edges as implied by the given property types, if the {@link Subgraph} is invalid at the time of
 * method call (e.g. by missing property type endpoints), this will not loop through the vertex set to finish incomplete
 * edges.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding edges
 * @param {OntologyTypeVertexId[]} propertyTypeVertexIds - the IDs of the property types to resolve edges for
 */
export const resolvePropertyTypeEdgesToSubgraphByMutation = (
  subgraph: Subgraph<boolean>,
  propertyTypeVertexIds: OntologyTypeVertexId[],
) => {
  for (const {
    baseId: baseUrl,
    revisionId: version,
  } of propertyTypeVertexIds) {
    const vertex = subgraph.vertices[baseUrl]?.[version];

    if (!vertex) {
      return undefined;
    }

    if (!isPropertyTypeVertex(vertex)) {
      throw new Error(`expected property type vertex but got: ${vertex.kind}`);
    }

    const { constrainsValuesOnDataTypes, constrainsPropertiesOnPropertyTypes } =
      getReferencedIdsFromPropertyType(vertex.inner.schema);

    for (const { edgeKind, endpoints } of [
      {
        edgeKind: "CONSTRAINS_VALUES_ON" as const,
        endpoints: constrainsValuesOnDataTypes,
      },
      {
        edgeKind: "CONSTRAINS_PROPERTIES_ON" as const,
        endpoints: constrainsPropertiesOnPropertyTypes,
      },
    ]) {
      for (const versionedUrl of endpoints) {
        const targetBaseUrl = extractBaseUrl(versionedUrl);
        const targetRevisionId = extractVersion(versionedUrl).toString();

        // If the endpoint vertex isn't currently in the subgraph, we won't add the edge.
        // We expect all vertices to be present before adding edges.
        if (!subgraph.vertices[targetBaseUrl]?.[targetRevisionId]) {
          continue;
        }

        addOutwardEdgeToSubgraphByMutation(
          subgraph,
          baseUrl,
          version.toString(),
          {
            kind: edgeKind,
            reversed: false,
            rightEndpoint: {
              baseId: targetBaseUrl,
              revisionId: targetRevisionId,
            },
          },
        );

        addOutwardEdgeToSubgraphByMutation(
          subgraph,
          targetBaseUrl,
          targetRevisionId,
          {
            kind: edgeKind,
            reversed: true,
            rightEndpoint: {
              baseId: baseUrl,
              revisionId: version.toString(),
            },
          },
        );
      }
    }
  }
};
