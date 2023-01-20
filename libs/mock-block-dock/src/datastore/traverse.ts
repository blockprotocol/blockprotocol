import {
  EntityId,
  GraphElementVertexId,
  HasLeftEntityEdge,
  HasRightEntityEdge,
  IncomingLinkEdge,
  OutgoingLinkEdge,
  Subgraph,
} from "@blockprotocol/graph";
import { addKnowledgeGraphEdgeToSubgraphByMutation } from "@blockprotocol/graph/internal";
import {
  getIncomingLinksForEntity,
  getLeftEntityForLinkEntity,
  getOutgoingLinksForEntity,
} from "@blockprotocol/graph/stdlib";
import { getRightEntityForLinkEntity } from "@blockprotocol/graph/stdlib-temporal";

import { typedEntries } from "../util";
import { ResolveMap } from "./traverse/resolve-map";
import { PartialDepths, TraversalContext } from "./traverse/traversal-context";

/** @todo - doc */
/** @todo - Update this to take an interval instead of always being "latest" */
/** @todo - Update this to handle ontology edges */
/** @todo - Update this to use temporal versioning information */
export const traverseElement = (
  traversalSubgraph: Subgraph,
  elementIdentifier: GraphElementVertexId,
  datastore: Subgraph,
  traversalContext: TraversalContext,
  currentTraversalDepths: PartialDepths,
) => {
  const unresolvedDepths = traversalContext.insert(
    elementIdentifier,
    currentTraversalDepths,
  );

  if (Object.keys(unresolvedDepths).length === 0) {
    return;
  }

  const element =
    datastore.vertices[elementIdentifier.baseId]?.[
      elementIdentifier.revisionId
    ];

  if (!element) {
    throw new Error(
      `Couldn't find element in graph associated with identifier: ${JSON.stringify(
        elementIdentifier,
      )}`,
    );
  }

  const revisionsInTraversalSubgraph =
    traversalSubgraph.vertices[elementIdentifier.baseId];

  // `any` casts here are because TypeScript wants us to narrow the Identifier type before trusting us
  if (revisionsInTraversalSubgraph) {
    (revisionsInTraversalSubgraph as any)[elementIdentifier.revisionId] =
      element;
  } else {
    // eslint-disable-next-line no-param-reassign -- The point of this function is to mutate the subgraph
    (traversalSubgraph as any).vertices[elementIdentifier.baseId] = {
      [elementIdentifier.revisionId]: element,
    };
  }

  const toResolve: ResolveMap = new ResolveMap({});

  for (const [edgeKind, depths] of typedEntries(unresolvedDepths)) {
    // Little hack for typescript, this is wrapped in a function with a return value to get type safety to ensure the
    // switch statement is exhaustive. Try removing a case to see.
    ((): boolean => {
      switch (edgeKind) {
        case "hasLeftEntity": {
          const entityId = elementIdentifier.baseId as EntityId;

          if (depths.incoming) {
            // get outgoing links for entity and insert edges
            for (const outgoingLinkEntity of getOutgoingLinksForEntity(
              datastore,
              entityId,
            )) {
              const {
                metadata: {
                  recordId: {
                    entityId: outgoingLinkEntityId,
                    editionId: edgeTimestamp,
                  },
                },
              } = outgoingLinkEntity;

              const outgoingLinkEdge: OutgoingLinkEdge = {
                kind: "HAS_LEFT_ENTITY",
                reversed: true,
                rightEndpoint: {
                  baseId: outgoingLinkEntityId,
                  timestamp: edgeTimestamp,
                },
              };

              addKnowledgeGraphEdgeToSubgraphByMutation(
                traversalSubgraph,
                entityId,
                edgeTimestamp,
                outgoingLinkEdge,
              );

              /** @todo - This is temporary, and wrong */
              toResolve.insert(
                {
                  baseId: outgoingLinkEntity.metadata.recordId.entityId,
                  revisionId: outgoingLinkEntity.metadata.recordId.editionId,
                },
                {
                  [edgeKind]: { incoming: depths.incoming - 1 },
                },
              );
            }
          }
          if (depths.outgoing) {
            if (
              "linkData" in element.inner &&
              element.inner.linkData?.leftEntityId !== undefined &&
              element.inner.linkData?.rightEntityId !== undefined
            ) {
              // get left entity for link entity and insert edges
              const leftEntity = getLeftEntityForLinkEntity(
                datastore,
                entityId,
              );
              const {
                metadata: {
                  recordId: {
                    entityId: leftEntityId,
                    editionId: edgeTimestamp,
                  },
                },
              } = leftEntity;

              const hasLeftEntityEdge: HasLeftEntityEdge = {
                kind: "HAS_LEFT_ENTITY",
                reversed: false,
                rightEndpoint: {
                  baseId: leftEntityId,
                  timestamp: edgeTimestamp,
                },
              };

              addKnowledgeGraphEdgeToSubgraphByMutation(
                traversalSubgraph,
                entityId,
                edgeTimestamp,
                hasLeftEntityEdge,
              );

              /** @todo - This is temporary, and wrong */
              toResolve.insert(
                {
                  baseId: leftEntity.metadata.recordId.entityId,
                  revisionId: leftEntity.metadata.recordId.editionId,
                },
                {
                  [edgeKind]: { outgoing: depths.outgoing - 1 },
                },
              );
            }
          }

          return true;
        }
        case "hasRightEntity": {
          const entityId = elementIdentifier.baseId as EntityId;

          if (depths.incoming) {
            // get incoming links for entity and insert edges
            for (const incomingLinkEntity of getIncomingLinksForEntity(
              datastore,
              entityId,
            )) {
              const {
                metadata: {
                  recordId: {
                    entityId: incomingLinkEntityId,
                    editionId: edgeTimestamp,
                  },
                },
              } = incomingLinkEntity;

              const incomingLinkEdge: IncomingLinkEdge = {
                kind: "HAS_RIGHT_ENTITY",
                reversed: true,
                rightEndpoint: {
                  baseId: incomingLinkEntityId,
                  timestamp: edgeTimestamp,
                },
              };

              addKnowledgeGraphEdgeToSubgraphByMutation(
                traversalSubgraph,
                entityId,
                edgeTimestamp,
                incomingLinkEdge,
              );

              /** @todo - This is temporary, and wrong */
              toResolve.insert(
                {
                  baseId: incomingLinkEntity.metadata.recordId.entityId,
                  revisionId: incomingLinkEntity.metadata.recordId.editionId,
                },
                {
                  [edgeKind]: { incoming: depths.incoming - 1 },
                },
              );
            }
          }
          if (depths.outgoing) {
            if (
              "linkData" in element.inner &&
              element.inner.linkData?.leftEntityId !== undefined &&
              element.inner.linkData?.rightEntityId !== undefined
            ) {
              // get right entity for link entity and insert edges
              const rightEntity = getRightEntityForLinkEntity(
                datastore,
                entityId,
              );
              const {
                metadata: {
                  recordId: {
                    entityId: rightEntityId,
                    editionId: edgeTimestamp,
                  },
                },
              } = rightEntity;

              const hasLeftEntityEdge: HasRightEntityEdge = {
                kind: "HAS_RIGHT_ENTITY",
                reversed: false,
                rightEndpoint: {
                  baseId: rightEntityId,
                  timestamp: edgeTimestamp,
                },
              };

              addKnowledgeGraphEdgeToSubgraphByMutation(
                traversalSubgraph,
                entityId,
                edgeTimestamp,
                hasLeftEntityEdge,
              );

              /** @todo - This is temporary, and wrong */
              toResolve.insert(
                {
                  baseId: rightEntity.metadata.recordId.entityId,
                  revisionId: rightEntity.metadata.recordId.editionId,
                },
                {
                  [edgeKind]: { outgoing: depths.outgoing - 1 },
                },
              );
            }
          }
          return true;
        }
      }
    })();
  }

  for (const [siblingElementIdentifierString, depths] of typedEntries(
    toResolve.map,
  )) {
    traverseElement(
      traversalSubgraph,
      JSON.parse(siblingElementIdentifierString) as GraphElementVertexId,
      datastore,
      traversalContext,
      depths.inner,
    );
  }
};
