import {
  GetEntityData,
  Subgraph,
  SubgraphRootTypes,
} from "@blockprotocol/graph";
import { getEntity as getEntityFromSubgraph } from "@blockprotocol/graph/stdlib";

import { traverseElement } from "../../traverse";
import { TraversalContext } from "../../traverse/traversal-context";

export const getEntity = (
  {
    entityId,
    graphResolveDepths = {
      hasLeftEntity: { incoming: 1, outgoing: 1 },
      hasRightEntity: { incoming: 1, outgoing: 1 },
    },
  }: GetEntityData,
  graph: Subgraph,
): Subgraph<SubgraphRootTypes["entity"]> | undefined => {
  const entityRevision = getEntityFromSubgraph(graph, entityId);

  if (entityRevision === undefined) {
    return undefined;
  }

  const subgraph = {
    /** @todo - This is temporary, and wrong */
    roots: [
      {
        baseId: entityRevision.metadata.recordId.baseId,
        revisionId: entityRevision.metadata.recordId.versionId,
      },
    ],
    vertices: {},
    edges: {},
    depths: graphResolveDepths,
  };

  traverseElement(
    subgraph,
    entityRevision.metadata.recordId,
    graph,
    new TraversalContext(graph),
    graphResolveDepths,
  );

  return subgraph;
};
