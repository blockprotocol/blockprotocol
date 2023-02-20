import { addOutwardEdgeToSubgraphByMutation } from "@blockprotocol/graph/internal";
import {
  EntityId,
  EntityIdWithInterval,
  GraphElementVertexId,
  GraphResolveDepths,
  HasLeftEntityEdge,
  HasRightEntityEdge,
  IncomingLinkEdge,
  isEntityVertex,
  KnowledgeGraphOutwardEdge,
  OntologyRootedEdges,
  OutgoingLinkEdge,
  OutwardEdge,
  Subgraph,
  SubgraphRootType,
  TimeInterval,
  Vertex,
} from "@blockprotocol/graph/temporal";
import {
  getIncomingLinksForEntity,
  getLeftEntityForLinkEntity,
  getOutgoingLinksForEntity,
  getRightEntityForLinkEntity,
  intervalIntersectionWithInterval,
  mapElementsIntoRevisions,
} from "@blockprotocol/graph/temporal/stdlib";

import {
  mustBeDefined,
  typedEntries,
  typedKeys,
  typedValues,
} from "../../util";

const TIMESTAMP_PLACEHOLDER = "TIMESTAMP_PLACEHOLDER" as const;

/**
 * Advanced type to recursively search a type for `EntityIdWithInterval` and patch those occurrences by removing the
 * definition of the "interval" property.
 */
export type DeepOmitValidInterval<ToPatch extends unknown> =
  ToPatch extends object
    ? ToPatch extends EntityIdWithInterval
      ? Omit<ToPatch, "interval">
      : { [key in keyof ToPatch]: DeepOmitValidInterval<ToPatch[key]> }
    : ToPatch;

type PatchedOutgoingLinkEdge = DeepOmitValidInterval<OutgoingLinkEdge>;
type PatchedIncomingLinkEdge = DeepOmitValidInterval<IncomingLinkEdge>;
type PatchedHasLeftEntityEdge = DeepOmitValidInterval<HasLeftEntityEdge>;
type PatchedHasRightEntityEdge = DeepOmitValidInterval<HasRightEntityEdge>;

/**
 * A patched {@link Subgraph} type which is partially incomplete. Entity-to-entity edges aren't fully specified, as
 * to avoid many intermediary rewrites, the timestamps of the edges are filled in as a post-processing step and are left
 * unspecified until then.
 */
export type TraversalSubgraph<
  RootType extends SubgraphRootType = SubgraphRootType,
> = Omit<Subgraph<RootType>, "edges"> & {
  edges: DeepOmitValidInterval<
    | OntologyRootedEdges
    | {
        [entityId: EntityId]: Record<
          typeof TIMESTAMP_PLACEHOLDER,
          KnowledgeGraphOutwardEdge[]
        >;
      }
  >;
};

/**
 * Parallel of {@link addKnowledgeGraphEdgeToSubgraphByMutation} except that it operates on the patched
 * {@link TraversalSubgraph} and patched {@link KnowledgeGraphOutwardEdge} types.
 *
 * As such, this does not fully qualify the edge at point of insertion; later in the process there is a step which
 * updates the intervals for entity-related endpoints in the edges to be correct for the {@link Subgraph} as a whole.
 *
 * @param {TraversalSubgraph} traversalSubgraph
 * @param {EntityId} sourceEntityId
 * @param outwardEdge
 */
const patchedAddKnowledgeGraphEdge = (
  traversalSubgraph: TraversalSubgraph,
  sourceEntityId: EntityId,
  outwardEdge: DeepOmitValidInterval<KnowledgeGraphOutwardEdge>,
) =>
  addOutwardEdgeToSubgraphByMutation<true>(
    traversalSubgraph as Subgraph,
    sourceEntityId,
    TIMESTAMP_PLACEHOLDER,
    outwardEdge as KnowledgeGraphOutwardEdge,
  );

export const getNeighbors = <
  EdgeKind extends OutwardEdge["kind"],
  Reversed extends boolean,
>(
  traversalSubgraph: TraversalSubgraph,
  datastore: Subgraph,
  source: Vertex,
  edgeKind: EdgeKind,
  reversed: Reversed,
  interval: TimeInterval,
): Vertex[] => {
  switch (edgeKind) {
    case "HAS_LEFT_ENTITY": {
      if (!isEntityVertex(source)) {
        return [];
      }

      const { inner: sourceEntity } = source;

      const sourceEntityId = sourceEntity.metadata.recordId.entityId;

      if (reversed) {
        const outgoingLinks = getOutgoingLinksForEntity(
          datastore,
          sourceEntityId,
          interval,
        );
        const mappedRevisions = mapElementsIntoRevisions(outgoingLinks);

        for (const outgoingLinkEntityId of typedKeys(mappedRevisions)) {
          const outgoingLinkEdge: PatchedOutgoingLinkEdge = {
            kind: "HAS_LEFT_ENTITY",
            reversed: true,
            rightEndpoint: {
              entityId: outgoingLinkEntityId,
            },
          };

          patchedAddKnowledgeGraphEdge(
            traversalSubgraph,
            sourceEntityId,
            outgoingLinkEdge,
          );
        }

        return typedValues(mappedRevisions)
          .flat()
          .map((entity) => ({
            kind: "entity",
            inner: entity,
          }));
      } else if (
        sourceEntity.linkData?.leftEntityId !== undefined &&
        sourceEntity.linkData?.rightEntityId !== undefined
      ) {
        const leftEntityRevisions = mustBeDefined(
          getLeftEntityForLinkEntity(datastore, sourceEntityId, interval),
          `links must have left entities in the datastore, ${sourceEntityId} did not`,
        );
        const hasLeftEntityEdge: PatchedHasLeftEntityEdge = {
          kind: "HAS_LEFT_ENTITY",
          reversed: false,
          rightEndpoint: {
            /**
             * @todo - This assumes that once a link entity's endpoints cannot change. This is based on the assumption
             *   that once entity is a link, it's always a link, however we don't enforce this currently.
             */
            entityId: mustBeDefined(leftEntityRevisions[0]).metadata.recordId
              .entityId,
          },
        };

        patchedAddKnowledgeGraphEdge(
          traversalSubgraph,
          sourceEntityId,
          hasLeftEntityEdge,
        );

        return leftEntityRevisions.map((entity) => ({
          kind: "entity",
          inner: entity,
        }));
      }

      return [];
    }
    case "HAS_RIGHT_ENTITY": {
      if (!isEntityVertex(source)) {
        return [];
      }

      const { inner: sourceEntity } = source;

      const sourceEntityId = sourceEntity.metadata.recordId.entityId;

      if (reversed) {
        const incomingLinks = getIncomingLinksForEntity(
          datastore,
          sourceEntityId,
          interval,
        );
        const mappedRevisions = mapElementsIntoRevisions(incomingLinks);

        for (const incomingLinkEntityId of typedKeys(mappedRevisions)) {
          const incomingLinkEdge: PatchedIncomingLinkEdge = {
            kind: "HAS_RIGHT_ENTITY",
            reversed: true,
            rightEndpoint: {
              entityId: incomingLinkEntityId,
            },
          };

          patchedAddKnowledgeGraphEdge(
            traversalSubgraph,
            sourceEntityId,
            incomingLinkEdge,
          );
        }

        return typedValues(mappedRevisions)
          .flat()
          .map((entity) => ({
            kind: "entity",
            inner: entity,
          }));
      } else if (
        sourceEntity.linkData?.leftEntityId !== undefined &&
        sourceEntity.linkData?.rightEntityId !== undefined
      ) {
        const rightEntityRevisions = mustBeDefined(
          getRightEntityForLinkEntity(datastore, sourceEntityId, interval),
          `links must have right entities in the datastore, ${sourceEntityId} did not`,
        );
        const hasRightEntityEdge: PatchedHasRightEntityEdge = {
          kind: "HAS_RIGHT_ENTITY",
          reversed: false,
          rightEndpoint: {
            /**
             * @todo - This assumes that once a link entity's endpoints cannot change. This is based on the assumption
             *   that once entity is a link, it's always a link, however we don't enforce this currently.
             */
            entityId: mustBeDefined(rightEntityRevisions[0]).metadata.recordId
              .entityId,
          },
        };

        patchedAddKnowledgeGraphEdge(
          traversalSubgraph,
          sourceEntityId,
          hasRightEntityEdge,
        );

        return rightEntityRevisions.map((entity) => ({
          kind: "entity",
          inner: entity,
        }));
      }

      return [];
    }
    default: {
      throw new Error(`Currently unsupported traversal edge kind: ${edgeKind}`);
    }
  }
};

export const traverseElement = ({
  traversalSubgraph,
  datastore,
  element,
  elementIdentifier,
  interval,
  currentTraversalDepths,
}: {
  traversalSubgraph: TraversalSubgraph;
  datastore: Subgraph;
  element: Vertex;
  elementIdentifier: GraphElementVertexId;
  interval: TimeInterval;
  currentTraversalDepths: GraphResolveDepths;
}) => {
  // eslint-disable-next-line no-param-reassign -- The point of this function is to mutate the traversal subgraph
  traversalSubgraph.vertices[elementIdentifier.baseId] ??= {};
  // eslint-disable-next-line no-param-reassign -- The point of this function is to mutate the traversal subgraph
  traversalSubgraph.vertices[elementIdentifier.baseId]![
    elementIdentifier.revisionId
  ] ??= element;

  for (const [edgeKind, depthsPerDirection] of typedEntries(
    currentTraversalDepths,
  )) {
    for (const [direction, depth] of typedEntries(depthsPerDirection)) {
      if (depth < 1) {
        continue;
      }

      for (const neighborVertex of getNeighbors(
        traversalSubgraph,
        datastore,
        element,
        /** @todo - this will be unergonomic as soon as there are more supported edge kinds */
        edgeKind === "hasLeftEntity" ? "HAS_LEFT_ENTITY" : "HAS_RIGHT_ENTITY",
        direction === "incoming",
        interval,
      )) {
        let newIntersection: TimeInterval | null;
        let neighborVertexId: GraphElementVertexId;

        if (isEntityVertex(neighborVertex)) {
          // get from temporal data of the neighbor vertex
          const entityInterval =
            neighborVertex.inner.metadata.temporalVersioning[
              traversalSubgraph.temporalAxes.resolved.variable.axis
            ];
          newIntersection = intervalIntersectionWithInterval(
            interval,
            entityInterval,
          );
          neighborVertexId = {
            baseId: neighborVertex.inner.metadata.recordId.entityId,
            revisionId: entityInterval.start.limit,
          };
        } else {
          newIntersection = interval;
          neighborVertexId = {
            baseId: neighborVertex.inner.metadata.recordId.baseUri,
            revisionId:
              neighborVertex.inner.metadata.recordId.version.toString(),
          };
        }

        if (newIntersection) {
          traverseElement({
            traversalSubgraph,
            datastore,
            element: neighborVertex,
            elementIdentifier: neighborVertexId,
            interval: newIntersection,
            currentTraversalDepths: {
              ...currentTraversalDepths,
              [edgeKind]: {
                ...currentTraversalDepths[edgeKind],
                [direction]: depth - 1,
              },
            },
          });
        }
      }
    }
  }
};

/**
 * Takes the patched {@link TraversalSubgraph} and post-processes it to produce a fully-qualified {@link Subgraph}.
 *
 * This involves exploring all {@link OutwardEdge}s that have endpoints either from, or to, {@link Entity}s, and ensures
 * that the edges correctly specify the ranges at which they were active. This will be from the {@link Timestamp} at
 * which the edge first appeared in the {@link Subgraph}, to the {@link Timestamp} at which the edge was last seen in
 * the {@link Subgraph}.
 *
 * @param {TraversalSubgraph} traversalSubgraph
 */
export const finalizeSubgraph = <
  RootType extends SubgraphRootType = SubgraphRootType,
>(
  traversalSubgraph: TraversalSubgraph<RootType>,
): Subgraph<RootType> => {
  const finalizedSubgraph = {
    ...traversalSubgraph,
    edges: {} as Subgraph["edges"],
  };

  const variableAxis = traversalSubgraph.temporalAxes.resolved.variable.axis;

  const validRanges = Object.fromEntries(
    typedEntries(traversalSubgraph.vertices).map(([baseId, revisionMap]) => {
      const sortedRevisions = typedKeys(revisionMap).sort();

      const latestVertex = revisionMap[mustBeDefined(sortedRevisions.at(-1))]!;

      let latest;

      if (isEntityVertex(latestVertex)) {
        const endBound =
          latestVertex.inner.metadata.temporalVersioning[variableAxis].end;
        latest = endBound.kind === "unbounded" ? null : endBound.limit;
      } else {
        latest = latestVertex.inner.metadata.recordId.version;
      }

      return [baseId, { earliest: mustBeDefined(sortedRevisions[0]), latest }];
    }),
  );

  for (const [baseId, outwardEdgeMap] of typedEntries(
    traversalSubgraph.edges,
  )) {
    for (const [traversalEdgeFirstCreatedAt, outwardEdges] of typedEntries(
      outwardEdgeMap,
    )) {
      for (const outwardEdge of outwardEdges) {
        let finalizedOutwardEdge: OutwardEdge;
        let edgeFirstCreatedAt;

        switch (outwardEdge.kind) {
          case "HAS_LEFT_ENTITY":
          case "HAS_RIGHT_ENTITY": {
            let linkEntityValidRange;
            let endLimit;

            if (outwardEdge.reversed) {
              // incoming or outgoing link, we want the timestamps of the interval to refer to the earliest revision
              // of the link entity (right endpoint) in the subgraph, and the end bound of the latest revision
              linkEntityValidRange = mustBeDefined(
                validRanges[outwardEdge.rightEndpoint.entityId],
              );
              edgeFirstCreatedAt = linkEntityValidRange.earliest;
              endLimit = linkEntityValidRange.latest;
            } else {
              // `baseId` here refers to a link entity, we want the timestamp to be the earliest revision of it in
              // the subgraph
              linkEntityValidRange = mustBeDefined(validRanges[baseId]);
              edgeFirstCreatedAt = linkEntityValidRange.earliest;
              endLimit = linkEntityValidRange.latest;
            }

            finalizedOutwardEdge = {
              ...outwardEdge,
              rightEndpoint: {
                ...outwardEdge.rightEndpoint,
                interval: {
                  start: { kind: "inclusive", limit: edgeFirstCreatedAt },
                  end: endLimit
                    ? { kind: "exclusive", limit: endLimit as string }
                    : { kind: "unbounded" },
                },
              },
            };
            break;
          }
          case "IS_OF_TYPE": {
            if (outwardEdge.reversed) {
              throw new Error(
                `Reversed "IS_OF_TYPE" edge kinds are not currently supported in graph traversal`,
              );
            }

            edgeFirstCreatedAt = traversalEdgeFirstCreatedAt;
            finalizedOutwardEdge = outwardEdge;
            break;
          }
          default: {
            edgeFirstCreatedAt = traversalEdgeFirstCreatedAt;
            finalizedOutwardEdge = outwardEdge;
          }
        }

        finalizedSubgraph.edges[baseId] ??= {};
        finalizedSubgraph.edges[baseId]![edgeFirstCreatedAt] ??= [];
        (
          finalizedSubgraph.edges[baseId]![edgeFirstCreatedAt]! as OutwardEdge[]
        ).push(finalizedOutwardEdge);
      }
    }
  }

  return finalizedSubgraph;
};
