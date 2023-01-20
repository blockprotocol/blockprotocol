import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  Subgraph,
  SubgraphRootTypes,
} from "@blockprotocol/graph";
import { getEntities } from "@blockprotocol/graph/stdlib";

import { filterAndSortEntitiesOrTypes } from "../../../util";
import { traverseElement } from "../../traverse";
import { TraversalContext } from "../../traverse/traversal-context";

export const aggregateEntities = (
  {
    operation,
    graphResolveDepths = {
      hasLeftEntity: { incoming: 1, outgoing: 1 },
      hasRightEntity: { incoming: 1, outgoing: 1 },
    },
  }: AggregateEntitiesData,
  graph: Subgraph,
): AggregateEntitiesResult<Subgraph<SubgraphRootTypes["entity"]>> => {
  const { results, operation: appliedOperation } = filterAndSortEntitiesOrTypes(
    getEntities(graph),
    {
      operation,
    },
  );

  const subgraph = {
    roots: results.map((entity) => entity.metadata.recordId),
    vertices: {},
    edges: {},
    depths: graphResolveDepths,
  };

  for (const {
    metadata: { recordId },
  } of results) {
    traverseElement(
      subgraph,
      recordId,
      graph,
      new TraversalContext(graph),
      graphResolveDepths,
    );
  }

  return {
    results: subgraph,
    operation: appliedOperation,
  };
};
