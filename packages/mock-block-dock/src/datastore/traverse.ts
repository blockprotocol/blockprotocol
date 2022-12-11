import {
  EntityEditionId,
  EntityId,
  HasLeftEntityEdge,
  HasRightEntityEdge,
  IncomingLinkEdge,
  OntologyTypeEditionId,
  OutgoingLinkEdge,
  Subgraph,
} from "@blockprotocol/graph";
import {
  getIncomingLinksForEntity,
  getLeftEntityForLinkEntity,
  getOutgoingLinksForEntity,
} from "@blockprotocol/graph/stdlib";
import { getRightEntityForLinkEntity } from "@blockprotocol/graph/stdlib-temporal";

import { typedEntries } from "../util";
import { addKnowledgeGraphEdge } from "./mutate-subgraph";
import { ResolveMap } from "./traverse/resolve-map";
import { PartialDepths, TraversalContext } from "./traverse/traversal-context";

/** @todo - doc */
/** @todo - Update this to take an interval instead of always being "latest" */
/** @todo - Update this to handle ontology edges */
export const traverseElement = (
  traversalSubgraph: Subgraph,
  elementIdentifier: EntityEditionId | OntologyTypeEditionId,
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
    datastore.vertices[elementIdentifier.baseId]?.[elementIdentifier.versionId];

  if (!element) {
    throw new Error(
      `Couldn't find element in graph associated with identifier: ${JSON.stringify(
        elementIdentifier,
      )}`,
    );
  }

  const editionsInTraversalSubgraph =
    traversalSubgraph.vertices[elementIdentifier.baseId];

  // `any` casts here are because TypeScript wants us to narrow the Identifier type before trusting us
  if (editionsInTraversalSubgraph) {
    (editionsInTraversalSubgraph as any)[elementIdentifier.versionId] = element;
  } else {
    // eslint-disable-next-line no-param-reassign -- The point of this function is to mutate the subgraph
    (traversalSubgraph as any).vertices[elementIdentifier.baseId] = {
      [elementIdentifier.versionId]: element,
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
                  editionId: {
                    baseId: outgoingLinkEntityId,
                    versionId: edgeTimestamp,
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

              addKnowledgeGraphEdge(
                traversalSubgraph,
                entityId,
                edgeTimestamp,
                outgoingLinkEdge,
              );

              toResolve.insert(outgoingLinkEntity.metadata.editionId, {
                [edgeKind]: { incoming: depths.incoming - 1 },
              });
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
                  editionId: { baseId: leftEntityId, versionId: edgeTimestamp },
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

              addKnowledgeGraphEdge(
                traversalSubgraph,
                entityId,
                edgeTimestamp,
                hasLeftEntityEdge,
              );

              toResolve.insert(leftEntity.metadata.editionId, {
                [edgeKind]: { outgoing: depths.outgoing - 1 },
              });
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
                  editionId: {
                    baseId: incomingLinkEntityId,
                    versionId: edgeTimestamp,
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

              addKnowledgeGraphEdge(
                traversalSubgraph,
                entityId,
                edgeTimestamp,
                incomingLinkEdge,
              );

              toResolve.insert(incomingLinkEntity.metadata.editionId, {
                [edgeKind]: { incoming: depths.incoming - 1 },
              });
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
                  editionId: {
                    baseId: rightEntityId,
                    versionId: edgeTimestamp,
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

              addKnowledgeGraphEdge(
                traversalSubgraph,
                entityId,
                edgeTimestamp,
                hasLeftEntityEdge,
              );

              toResolve.insert(rightEntity.metadata.editionId, {
                [edgeKind]: { outgoing: depths.outgoing - 1 },
              });
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
      JSON.parse(siblingElementIdentifierString) as
        | EntityEditionId
        | OntologyTypeEditionId,
      datastore,
      traversalContext,
      depths.inner,
    );
  }
};
