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
  const entityEdition = getEntityFromSubgraph(graph, entityId);

  if (entityEdition === undefined) {
    return undefined;
  }

  const subgraph = {
    roots: [entityEdition.metadata.editionId],
    vertices: {},
    edges: {},
    depths: graphResolveDepths,
  };

  traverseElement(
    subgraph,
    entityEdition.metadata.editionId,
    graph,
    new TraversalContext(graph),
    graphResolveDepths,
  );

  return subgraph;
};
