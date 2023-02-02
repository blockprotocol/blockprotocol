import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  EntityRootType,
  Subgraph,
} from "@blockprotocol/graph";
import { getEntities } from "@blockprotocol/graph/stdlib";

import { filterAndSortEntitiesOrTypes } from "../../../util";
import { getDefaultTemporalAxes } from "../../get-default-temporal-axes";
import { resolveTemporalAxes } from "../../resolve-temporal-axes";
import {
  finalizeSubgraph,
  TraversalSubgraph,
  traverseElement,
} from "../../traverse";

const aggregateEntitiesImpl = (
  {
    operation,
    graphResolveDepths = {
      hasLeftEntity: { incoming: 1, outgoing: 1 },
      hasRightEntity: { incoming: 1, outgoing: 1 },
    },
    temporalAxes,
  }: AggregateEntitiesData<true>,
  graph: Subgraph<true>,
): AggregateEntitiesResult<true, Subgraph<true, EntityRootType<true>>> => {
  const resolvedTemporalAxes = resolveTemporalAxes(temporalAxes);

  const { results, operation: appliedOperation } =
    filterAndSortEntitiesOrTypes<true>(getEntities<true>(graph), {
      operation,
      temporalAxes: resolvedTemporalAxes,
    });

  const traversalSubgraph: TraversalSubgraph<true, EntityRootType<true>> = {
    roots: results.map((entity) => ({
      baseId: entity.metadata.recordId.entityId,
      revisionId:
        entity.metadata.temporalVersioning[temporalAxes.variable.axis].start
          .limit,
    })),
    vertices: {},
    edges: {},
    depths: graphResolveDepths,
    temporalAxes: {
      initial: temporalAxes,
      resolved: resolvedTemporalAxes,
    },
  };

  for (const entityRevision of results) {
    traverseElement({
      traversalSubgraph,
      datastore: graph,
      element: { kind: "entity", inner: entityRevision },
      elementIdentifier: {
        baseId: entityRevision.metadata.recordId.entityId,
        revisionId:
          entityRevision.metadata.temporalVersioning[
            resolvedTemporalAxes.variable.axis
          ].start.limit,
      },
      currentTraversalDepths: graphResolveDepths,
      interval: resolvedTemporalAxes.variable.interval,
    });
  }

  return {
    results: finalizeSubgraph(traversalSubgraph),
    operation: appliedOperation,
  };
};

export const aggregateEntities = <Temporal extends boolean>(
  data: AggregateEntitiesData<Temporal>,
  graph: Subgraph<true>,
): AggregateEntitiesResult<
  Temporal,
  Subgraph<Temporal, EntityRootType<Temporal>>
> => {
  // this cast is safe as we're only checking against undefined
  if ((data as AggregateEntitiesData<true>).temporalAxes !== undefined) {
    return aggregateEntitiesImpl(
      data as AggregateEntitiesData<true>,
      graph,
    ) as AggregateEntitiesResult<
      Temporal,
      Subgraph<Temporal, EntityRootType<Temporal>>
    >;
  } else {
    return aggregateEntitiesImpl(
      {
        ...(data as AggregateEntitiesData<false>),
        temporalAxes: getDefaultTemporalAxes(),
      },
      graph,
    ) as AggregateEntitiesResult<
      Temporal,
      Subgraph<Temporal, EntityRootType<Temporal>>
    >;
  }
};
