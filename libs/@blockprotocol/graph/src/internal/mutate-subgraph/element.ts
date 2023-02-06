import {
  extractBaseUri,
  extractVersion,
  getReferencedIdsFromEntityType,
  getReferencedIdsFromPropertyType,
} from "@blockprotocol/type-system/slim";

import { unionOfIntervals } from "../../stdlib/interval.js";
import { Entity, EntityId } from "../../types/entity.js";
import {
  DataTypeVertex,
  DataTypeWithMetadata,
  EntityIdWithInterval,
  EntityTypeVertex,
  EntityTypeWithMetadata,
  EntityVertex,
  isTemporalSubgraph,
  KnowledgeGraphVertices,
  PropertyTypeVertex,
  PropertyTypeWithMetadata,
  Subgraph,
} from "../../types/subgraph.js";
import { addOutwardEdgeToSubgraphByMutation } from "./edge.js";

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph} by adding a given list of data types to the vertices, creating any ontology
 * related edges that are **directly implied** by them (see note below).
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * *Note*: This only adds edges as implied by the given data types, if the {@link Subgraph} is invalid at the time of
 * method call (e.g. by missing data type endpoints), this will not loop through the vertex set to finish incomplete
 * edges.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the provided entities
 * @param {DataTypeWithMetadata[]} dataTypes – the data types to add to the provided subgraph
 */
export const addDataTypesToSubgraphByMutation = (
  subgraph: Subgraph<boolean>,
  dataTypes: DataTypeWithMetadata[],
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  for (const dataType of dataTypes) {
    const { baseUri, version } = dataType.metadata.recordId;

    const dataTypeVertex: DataTypeVertex = {
      kind: "dataType",
      inner: dataType,
    };

    subgraph.vertices[baseUri] ??= {};
    subgraph.vertices[baseUri]![version] = dataTypeVertex;

    /** @todo - with the introduction of non-primitive data types edges will need to be added here */
  }
  /* eslint-enable no-param-reassign */
};

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph} by adding a given list of property types to the vertices, creating any ontology
 * related edges that are **directly implied** by them (see note below).
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * *Note*: This only adds edges as implied by the given property types, if the {@link Subgraph} is invalid at the time of
 * method call (e.g. by missing property type endpoints), this will not loop through the vertex set to finish incomplete
 * edges.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the provided entities
 * @param {PropertyTypeWithMetadata[]} propertyTypes – the data types to add to the provided subgraph
 */
export const addPropertyTypesToSubgraphByMutation = (
  subgraph: Subgraph<boolean>,
  propertyTypes: PropertyTypeWithMetadata[],
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  for (const propertyType of propertyTypes) {
    const { baseUri, version } = propertyType.metadata.recordId;

    const propertyTypeVertex: PropertyTypeVertex = {
      kind: "propertyType",
      inner: propertyType,
    };

    subgraph.vertices[baseUri] ??= {};
    subgraph.vertices[baseUri]![version] = propertyTypeVertex;

    const { constrainsValuesOnDataTypes, constrainsPropertiesOnPropertyTypes } =
      getReferencedIdsFromPropertyType(propertyType.schema);

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
      for (const versionedUri of endpoints) {
        const targetBaseUri = extractBaseUri(versionedUri);
        const targetRevisionId = extractVersion(versionedUri).toString();

        addOutwardEdgeToSubgraphByMutation(
          subgraph,
          baseUri,
          version.toString(),
          {
            kind: edgeKind,
            reversed: false,
            rightEndpoint: {
              baseId: targetBaseUri,
              revisionId: targetRevisionId,
            },
          },
        );

        addOutwardEdgeToSubgraphByMutation(
          subgraph,
          targetBaseUri,
          targetRevisionId,
          {
            kind: edgeKind,
            reversed: true,
            rightEndpoint: {
              baseId: baseUri,
              revisionId: version.toString(),
            },
          },
        );
      }
    }
  }
  /* eslint-enable no-param-reassign */
};

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph} by adding a given list of entity types to the vertices, creating any ontology
 * related edges that are **directly implied** by them (see note below).
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * *Note*: This only adds edges as implied by the given entity types, if the {@link Subgraph} is invalid at the time of
 * method call (e.g. by missing entity type endpoints), this will not loop through the vertex set to finish incomplete
 * edges.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the provided entities
 * @param {EntityTypeWithMetadata[]} entityTypes – the data types to add to the provided subgraph
 */
export const addEntityTypesToSubgraphByMutation = (
  subgraph: Subgraph<boolean>,
  entityTypes: EntityTypeWithMetadata[],
) => {
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  for (const entityType of entityTypes) {
    const { baseUri, version } = entityType.metadata.recordId;

    const entityTypeVertex: EntityTypeVertex = {
      kind: "entityType",
      inner: entityType,
    };

    subgraph.vertices[baseUri] ??= {};
    subgraph.vertices[baseUri]![version] = entityTypeVertex;

    const {
      constrainsPropertiesOnPropertyTypes,
      constrainsLinksOnEntityTypes,
      constrainsLinkDestinationsOnEntityTypes,
    } = getReferencedIdsFromEntityType(entityType.schema);

    for (const { edgeKind, endpoints } of [
      {
        edgeKind: "CONSTRAINS_PROPERTIES_ON" as const,
        endpoints: constrainsPropertiesOnPropertyTypes,
      },
      {
        edgeKind: "CONSTRAINS_LINKS_ON" as const,
        endpoints: constrainsLinksOnEntityTypes,
      },
      {
        edgeKind: "CONSTRAINS_LINK_DESTINATIONS_ON" as const,
        endpoints: constrainsLinkDestinationsOnEntityTypes,
      },
    ]) {
      for (const versionedUri of endpoints) {
        const targetBaseUri = extractBaseUri(versionedUri);
        const targetRevisionId = extractVersion(versionedUri).toString();

        addOutwardEdgeToSubgraphByMutation(
          subgraph,
          baseUri,
          version.toString(),
          {
            kind: edgeKind,
            reversed: false,
            rightEndpoint: {
              baseId: targetBaseUri,
              revisionId: targetRevisionId,
            },
          },
        );

        addOutwardEdgeToSubgraphByMutation(
          subgraph,
          targetBaseUri,
          targetRevisionId,
          {
            kind: edgeKind,
            reversed: true,
            rightEndpoint: {
              baseId: baseUri,
              revisionId: version.toString(),
            },
          },
        );
      }
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
