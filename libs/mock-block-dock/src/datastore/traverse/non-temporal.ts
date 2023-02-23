import {
  EntityId,
  GraphElementVertexId,
  GraphResolveDepths,
  HasLeftEntityEdge,
  HasRightEntityEdge,
  IncomingLinkEdge,
  isEntityVertex,
  KnowledgeGraphOutwardEdge,
  OutgoingLinkEdge,
  OutwardEdge,
  Subgraph,
  SubgraphRootType,
  Vertex,
} from "@blockprotocol/graph";
import { addOutwardEdgeToSubgraphByMutation } from "@blockprotocol/graph/internal";
import {
  getIncomingLinksForEntity,
  getLeftEntityForLinkEntity,
  getOutgoingLinksForEntity,
  getRightEntityForLinkEntity,
} from "@blockprotocol/graph/stdlib";

import { mustBeDefined, typedEntries } from "../../util";
import { DeepOmitValidInterval } from "./temporal";

export type TraversalSubgraph<
  RootType extends SubgraphRootType = SubgraphRootType,
> = Subgraph<RootType>;

const addKnowledgeGraphEdge = (
  traversalSubgraph: TraversalSubgraph,
  sourceEntityId: EntityId,
  outwardEdge: DeepOmitValidInterval<KnowledgeGraphOutwardEdge>,
) =>
  addOutwardEdgeToSubgraphByMutation<false>(
    traversalSubgraph as Subgraph,
    sourceEntityId,
    new Date(0).toISOString(),
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
        );

        for (const {
          metadata: {
            recordId: { entityId: outgoingLinkEntityId },
          },
        } of outgoingLinks) {
          const outgoingLinkEdge: OutgoingLinkEdge = {
            kind: "HAS_LEFT_ENTITY",
            reversed: true,
            rightEndpoint: outgoingLinkEntityId,
          };

          addKnowledgeGraphEdge(
            traversalSubgraph,
            sourceEntityId,
            outgoingLinkEdge,
          );
        }

        return outgoingLinks.map((entity) => ({
          kind: "entity",
          inner: entity,
        }));
      } else if (
        sourceEntity.linkData?.leftEntityId !== undefined &&
        sourceEntity.linkData?.rightEntityId !== undefined
      ) {
        const leftEntity = mustBeDefined(
          getLeftEntityForLinkEntity(datastore, sourceEntityId),
          `links must have left entities in the datastore, ${sourceEntityId} did not`,
        );
        const hasLeftEntityEdge: HasLeftEntityEdge = {
          kind: "HAS_LEFT_ENTITY",
          reversed: false,
          rightEndpoint: leftEntity.metadata.recordId.entityId,
        };

        addKnowledgeGraphEdge(
          traversalSubgraph,
          sourceEntityId,
          hasLeftEntityEdge,
        );

        return [
          {
            kind: "entity",
            inner: leftEntity,
          },
        ];
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
        );

        for (const {
          metadata: {
            recordId: { entityId: incomingLinkEntityId },
          },
        } of incomingLinks) {
          const incomingLinkEdge: IncomingLinkEdge = {
            kind: "HAS_RIGHT_ENTITY",
            reversed: true,
            rightEndpoint: incomingLinkEntityId,
          };

          addKnowledgeGraphEdge(
            traversalSubgraph,
            sourceEntityId,
            incomingLinkEdge,
          );
        }

        return incomingLinks.map((entity) => ({
          kind: "entity",
          inner: entity,
        }));
      } else if (
        sourceEntity.linkData?.leftEntityId !== undefined &&
        sourceEntity.linkData?.rightEntityId !== undefined
      ) {
        const rightEntity = mustBeDefined(
          getRightEntityForLinkEntity(datastore, sourceEntityId),
          `links must have right entities in the datastore, ${sourceEntityId} did not`,
        );
        const hasRightEntityEdge: HasRightEntityEdge = {
          kind: "HAS_RIGHT_ENTITY",
          reversed: false,
          rightEndpoint: mustBeDefined(rightEntity).metadata.recordId.entityId,
        };

        addKnowledgeGraphEdge(
          traversalSubgraph,
          sourceEntityId,
          hasRightEntityEdge,
        );

        return [
          {
            kind: "entity",
            inner: rightEntity,
          },
        ];
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
  currentTraversalDepths,
}: {
  traversalSubgraph: TraversalSubgraph;
  datastore: Subgraph;
  element: Vertex;
  elementIdentifier: GraphElementVertexId;
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
      )) {
        let neighborVertexId: GraphElementVertexId;

        if (isEntityVertex(neighborVertex)) {
          const entityId = neighborVertex.inner.metadata.recordId.entityId;
          neighborVertexId = {
            baseId: entityId,
            revisionId: mustBeDefined(
              Object.keys(datastore.vertices[entityId]!).pop(),
            ),
          };
        } else {
          neighborVertexId = {
            baseId: neighborVertex.inner.metadata.recordId.baseUrl,
            revisionId:
              neighborVertex.inner.metadata.recordId.version.toString(),
          };
        }

        traverseElement({
          traversalSubgraph,
          datastore,
          element: neighborVertex,
          elementIdentifier: neighborVertexId,
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
};
