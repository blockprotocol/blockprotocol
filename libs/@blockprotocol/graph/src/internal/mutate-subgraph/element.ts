import {
  extractBaseUrl,
  extractVersion,
  getReferencedIdsFromEntityType,
  getReferencedIdsFromPropertyType,
} from "@blockprotocol/type-system/slim";

import { unionOfIntervals } from "../../shared/stdlib/interval.js";
import { Entity, EntityId } from "../../shared/types/entity.js";
import {
  DataTypeVertex,
  DataTypeWithMetadata,
  EntityIdWithInterval,
  EntityTypeVertex,
  EntityTypeWithMetadata,
  EntityVertex,
  EntityVertexId,
  isTemporalSubgraph,
  OntologyTypeVertexId,
  PropertyTypeVertex,
  PropertyTypeWithMetadata,
  Subgraph,
} from "../../shared/types/subgraph.js";
import { addOutwardEdgeToSubgraphByMutation } from "./edge.js";

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph} by adding a given list of data types to the vertices.
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the provided entities
 * @param {DataTypeWithMetadata[]} dataTypes – the data types to add to the provided subgraph
 * @returns {OntologyTypeVertexId[]} – the vertex IDs of the data type vertices that were added
 */
export const addDataTypeVerticesToSubgraphByMutation = (
  subgraph: Subgraph<boolean>,
  dataTypes: DataTypeWithMetadata[],
): OntologyTypeVertexId[] => {
  const vertexIds: OntologyTypeVertexId[] = [];
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  for (const dataType of dataTypes) {
    const { baseUrl, version } = dataType.metadata.recordId;

    const dataTypeVertex: DataTypeVertex = {
      kind: "dataType",
      inner: dataType,
    };

    subgraph.vertices[baseUrl] ??= {};
    subgraph.vertices[baseUrl]![version] = dataTypeVertex;

    vertexIds.push({ baseId: baseUrl, revisionId: version.toString() });
  }
  /* eslint-enable no-param-reassign */
  return vertexIds;
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
 * @returns {OntologyTypeVertexId[]} – the vertex IDs of the property type vertices that were added
 */
export const addPropertyTypesToSubgraphByMutation = (
  subgraph: Subgraph<boolean>,
  propertyTypes: PropertyTypeWithMetadata[],
): OntologyTypeVertexId[] => {
  const vertexIds: OntologyTypeVertexId[] = [];
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  for (const propertyType of propertyTypes) {
    const { baseUrl, version } = propertyType.metadata.recordId;

    const propertyTypeVertex: PropertyTypeVertex = {
      kind: "propertyType",
      inner: propertyType,
    };

    subgraph.vertices[baseUrl] ??= {};
    subgraph.vertices[baseUrl]![version] = propertyTypeVertex;

    vertexIds.push({ baseId: baseUrl, revisionId: version.toString() });

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
      for (const versionedUrl of endpoints) {
        const targetBaseUrl = extractBaseUrl(versionedUrl);
        const targetRevisionId = extractVersion(versionedUrl).toString();

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
  /* eslint-enable no-param-reassign */
  return vertexIds;
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
 * @returns {OntologyTypeVertexId[]} – the vertex IDs of the entity type vertices that were added
 */
export const addEntityTypesToSubgraphByMutation = (
  subgraph: Subgraph<boolean>,
  entityTypes: EntityTypeWithMetadata[],
): OntologyTypeVertexId[] => {
  const vertexIds: OntologyTypeVertexId[] = [];
  /* eslint-disable no-param-reassign -- We want to mutate the input here */
  for (const entityType of entityTypes) {
    const { baseUrl, version } = entityType.metadata.recordId;

    const entityTypeVertex: EntityTypeVertex = {
      kind: "entityType",
      inner: entityType,
    };

    subgraph.vertices[baseUrl] ??= {};
    subgraph.vertices[baseUrl]![version] = entityTypeVertex;

    vertexIds.push({ baseId: baseUrl, revisionId: version.toString() });

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
      for (const versionedUrl of endpoints) {
        const targetBaseUrl = extractBaseUrl(versionedUrl);
        const targetRevisionId = extractVersion(versionedUrl).toString();

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
  /* eslint-enable no-param-reassign */
  return vertexIds;
};

/**
 * Looking to build a subgraph? You probably want {@link buildSubgraph} from `@blockprotocol/graph/stdlib`
 *
 * This MUTATES the given {@link Subgraph} by adding a given list of entities to the vertices, creating any link edges
 * that are **directly implied** by any link entities in the list (see note below).
 * Mutating a Subgraph is unsafe in most situations – you should know why you need to do it.
 *
 *
 * *Note*: This only adds edges as implied by the given entities, if the {@link Subgraph} is invalid at the time of
 * method call (e.g. by missing link endpoints), this will not loop through the vertex set to finish incomplete edges.
 *
 * @param {Subgraph} subgraph – the subgraph to mutate by adding the provided entities
 * @param {Entity[]} entities – the entities to add to the provided subgraph
 * @returns {EntityVertexId[]} – the vertex IDs of the added entities
 */
export const addEntitiesToSubgraphByMutation = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
  entities: Entity<Temporal>[],
): EntityVertexId[] => {
  const vertexIds: EntityVertexId[] = [];
  if (isTemporalSubgraph(subgraph)) {
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

      /*
        this cast should be safe as we have just checked if the Subgraph has temporal information, in which case the
        entities should too
      */
      const entityTemporal = entity as Entity<true>;
      const entityInterval: EntityIdWithInterval["interval"] =
        entityTemporal.metadata.temporalVersioning[
          subgraph.temporalAxes.resolved.variable.axis
        ];

      if (entityTemporal.linkData) {
        const linkInfo = linkMap[entityId];
        if (!linkInfo) {
          linkMap[entityId] = {
            leftEntityId: entityTemporal.linkData.leftEntityId,
            rightEntityId: entityTemporal.linkData.rightEntityId,
            edgeIntervals: [entityInterval],
          };
        } else {
          if (
            linkMap[entityId]!.leftEntityId !==
              entityTemporal.linkData.leftEntityId &&
            linkMap[entityId]!.rightEntityId !==
              entityTemporal.linkData.rightEntityId
          ) {
            /*
             * @todo This assumes that the left and right entity ID of a link entity is static for its entire lifetime, that is
             *   not necessarily going to continue being the case
             */
            throw new Error(
              `Link entity ${entityId} has multiple left and right entities`,
            );
          }
          linkInfo.edgeIntervals.push(
            entityTemporal.metadata.temporalVersioning[
              subgraph.temporalAxes.resolved.variable.axis
            ],
          );
        }
      }

      const entityVertex: EntityVertex<true> = {
        kind: "entity",
        inner: entityTemporal,
      };

      if (!subgraph.vertices[entityId]) {
        subgraph.vertices[entityId] = {
          [entityInterval.start.limit]: entityVertex,
        };
      } else {
        subgraph.vertices[entityId]![entityInterval.start.limit] = entityVertex;
      }

      vertexIds.push({
        baseId: entityId,
        revisionId: entityInterval.start.limit,
      });

      // Add IS_OF_TYPE edges for the entity and entity type
      const entityTypeId = entityVertex.inner.metadata.entityTypeId;
      const entityTypeBaseUrl = extractBaseUrl(entityTypeId);
      const entityTypeRevisionId = extractVersion(entityTypeId).toString();
      addOutwardEdgeToSubgraphByMutation(
        subgraph,
        entityId,
        entityInterval.start.limit,
        {
          kind: "IS_OF_TYPE",
          reversed: false,
          rightEndpoint: {
            baseId: entityTypeBaseUrl,
            revisionId: entityTypeRevisionId.toString(),
          },
        },
      );

      addOutwardEdgeToSubgraphByMutation(
        subgraph,
        entityTypeBaseUrl,
        entityTypeRevisionId,
        {
          kind: "IS_OF_TYPE",
          reversed: true,
          rightEndpoint: {
            entityId,
            interval: entityInterval,
          },
        },
      );
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
  } else {
    // unsure why this cast is needed
    const subgraphNonTemporal = subgraph as Subgraph<false>;

    const linkMap: Record<
      EntityId,
      {
        leftEntityId: EntityId;
        rightEntityId: EntityId;
      }
    > = {};

    for (const entity of entities) {
      const entityId = entity.metadata.recordId.entityId;

      /*
        this cast should be safe as we have just checked if the Subgraph has temporal information, in which case the
        entities should too
      */
      const entityNonTemporal = entity as Entity<false>;

      if (entityNonTemporal.linkData) {
        const linkInfo = linkMap[entityId];
        if (!linkInfo) {
          linkMap[entityId] = {
            leftEntityId: entityNonTemporal.linkData.leftEntityId,
            rightEntityId: entityNonTemporal.linkData.rightEntityId,
          };
        } else if (
          linkMap[entityId]!.leftEntityId !==
            entityNonTemporal.linkData.leftEntityId &&
          linkMap[entityId]!.rightEntityId !==
            entityNonTemporal.linkData.rightEntityId
        ) {
          /*
           * @todo This assumes that the left and right entity ID of a link entity is static for its entire lifetime, that is
           *   not necessarily going to continue being the case
           */
          throw new Error(
            `Link entity ${entityId} has multiple left and right entities`,
          );
        }
      }

      const entityVertex: EntityVertex<false> = {
        kind: "entity",
        inner: entityNonTemporal,
      };

      const timestamp = new Date(0).toISOString();

      if (!subgraphNonTemporal.vertices[entityId]) {
        subgraphNonTemporal.vertices[entityId] = {
          [timestamp]: entityVertex,
        };
      } else {
        throw new Error(
          `Encountered multiple entities with entityId ${entityId}`,
        );
      }
      vertexIds.push({
        baseId: entityId,
        revisionId: timestamp,
      });

      // Add IS_OF_TYPE edges for the entity and entity type
      const entityTypeId = entityVertex.inner.metadata.entityTypeId;
      const entityTypeBaseUrl = extractBaseUrl(entityTypeId);
      const entityTypeRevisionId = extractVersion(entityTypeId).toString();
      addOutwardEdgeToSubgraphByMutation(
        subgraphNonTemporal,
        entityId,
        timestamp,
        {
          kind: "IS_OF_TYPE",
          reversed: false,
          rightEndpoint: {
            baseId: entityTypeBaseUrl,
            revisionId: entityTypeRevisionId.toString(),
          },
        },
      );

      addOutwardEdgeToSubgraphByMutation(
        subgraphNonTemporal,
        entityTypeBaseUrl,
        entityTypeRevisionId,
        {
          kind: "IS_OF_TYPE",
          reversed: true,
          rightEndpoint: entityId,
        },
      );

      for (const [
        linkEntityId,
        { leftEntityId, rightEntityId },
      ] of Object.entries(linkMap)) {
        addOutwardEdgeToSubgraphByMutation(
          subgraphNonTemporal,
          linkEntityId,
          timestamp,
          {
            kind: "HAS_LEFT_ENTITY",
            reversed: false,
            rightEndpoint: leftEntityId,
          },
        );
        addOutwardEdgeToSubgraphByMutation(
          subgraphNonTemporal,
          leftEntityId,
          timestamp,
          {
            kind: "HAS_LEFT_ENTITY",
            reversed: true,
            rightEndpoint: linkEntityId,
          },
        );
        addOutwardEdgeToSubgraphByMutation(
          subgraphNonTemporal,
          linkEntityId,
          timestamp,
          {
            kind: "HAS_RIGHT_ENTITY",
            reversed: false,
            rightEndpoint: rightEntityId,
          },
        );
        addOutwardEdgeToSubgraphByMutation(
          subgraphNonTemporal,
          rightEntityId,
          timestamp,
          {
            kind: "HAS_RIGHT_ENTITY",
            reversed: true,
            rightEndpoint: linkEntityId,
          },
        );
      }
    }
  }
  /* eslint-enable no-param-reassign */
  return vertexIds;
};
