import {
  EntityRootType as EntityRootTypeNonTemporal,
  GraphResolveDepths,
  QueryEntitiesData as QueryEntitiesDataNonTemporal,
  QueryEntitiesResult as QueryEntitiesResultNonTemporal,
  Subgraph as SubgraphNonTemporal,
} from "@blockprotocol/graph";
import { isTemporalSubgraph } from "@blockprotocol/graph/internal";
import { getEntities as getEntitiesNonTemporal } from "@blockprotocol/graph/stdlib";
import {
  EntityRootType as EntityRootTypeTemporal,
  QueryEntitiesData as QueryEntitiesDataTemporal,
  QueryEntitiesResult as QueryEntitiesResultTemporal,
  Subgraph as SubgraphTemporal,
} from "@blockprotocol/graph/temporal";
import { getEntities as getEntitiesTemporal } from "@blockprotocol/graph/temporal/stdlib";

import { InconsistentTemporalVersioningSupportError } from "../../../error";
import { filterAndSortEntitiesOrTypes } from "../../../util";
import { resolveTemporalAxes } from "../../resolve-temporal-axes";
import { traverseElement } from "../../traverse";
import { TraversalSubgraph as TraversalSubgraphNonTemporal } from "../../traverse/non-temporal";
import {
  finalizeSubgraph as finalizeSubgraphTemporal,
  TraversalSubgraph as TraversalSubgraphTemporal,
} from "../../traverse/temporal";

const defaultGraphResolveDepths: GraphResolveDepths = {
  hasLeftEntity: { incoming: 1, outgoing: 1 },
  hasRightEntity: { incoming: 1, outgoing: 1 },
  constrainsLinkDestinationsOn: { outgoing: 0 },
  constrainsLinksOn: { outgoing: 0 },
  constrainsPropertiesOn: { outgoing: 0 },
  constrainsValuesOn: { outgoing: 0 },
  inheritsFrom: { outgoing: 0 },
  isOfType: { outgoing: 0 },
};

type QueryEntitiesReturn<Temporal extends boolean> = Temporal extends true
  ? QueryEntitiesResultTemporal<SubgraphTemporal<EntityRootTypeTemporal>>
  : QueryEntitiesResultNonTemporal<
      SubgraphNonTemporal<EntityRootTypeNonTemporal>
    >;

export const queryEntities = <Temporal extends boolean>(
  data: Temporal extends true
    ? QueryEntitiesDataTemporal
    : QueryEntitiesDataNonTemporal,
  graph: Temporal extends true ? SubgraphTemporal : SubgraphNonTemporal,
): QueryEntitiesReturn<Temporal> => {
  if (
    // this cast should be safe because we're only checking if temporalAxes is defined
    (data as QueryEntitiesDataTemporal).temporalAxes !== undefined &&
    isTemporalSubgraph(graph)
  ) {
    const {
      operation,
      graphResolveDepths = {},
      temporalAxes,
    } = data as QueryEntitiesDataTemporal;

    const fullyDefinedGraphResolveDepths = {
      ...defaultGraphResolveDepths,
      ...graphResolveDepths,
    };

    const resolvedTemporalAxes = resolveTemporalAxes(temporalAxes);

    const entities = getEntitiesTemporal(graph);

    const { results, operation: appliedOperation } =
      filterAndSortEntitiesOrTypes(entities, {
        operation,
        temporalAxes: resolvedTemporalAxes,
      });

    const traversalSubgraph: TraversalSubgraphTemporal<EntityRootTypeTemporal> =
      {
        roots: results.map((entity) => ({
          baseId: entity.metadata.recordId.entityId,
          revisionId:
            entity.metadata.temporalVersioning[
              resolvedTemporalAxes.variable.axis
            ].start.limit,
        })),
        vertices: {},
        edges: {},
        depths: fullyDefinedGraphResolveDepths,
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
        currentTraversalDepths: fullyDefinedGraphResolveDepths,
        interval: resolvedTemporalAxes.variable.interval,
      });
    }

    return {
      results: finalizeSubgraphTemporal(traversalSubgraph),
      operation: appliedOperation,
    } as QueryEntitiesReturn<Temporal>;
  } else if (
    // similarly, this cast should be safe because we're only checking if temporalAxes is undefined
    (data as QueryEntitiesDataTemporal).temporalAxes === undefined &&
    !isTemporalSubgraph(graph)
  ) {
    const { operation, graphResolveDepths = {} } =
      data as QueryEntitiesDataNonTemporal;

    const fullyDefinedGraphResolveDepths = {
      ...defaultGraphResolveDepths,
      ...graphResolveDepths,
    };

    const entities = getEntitiesNonTemporal(graph);

    const { results, operation: appliedOperation } =
      filterAndSortEntitiesOrTypes(entities, {
        operation,
      });

    const traversalSubgraph: TraversalSubgraphNonTemporal<EntityRootTypeNonTemporal> =
      {
        roots: results.map((entity) => ({
          baseId: entity.metadata.recordId.entityId,
          revisionId: new Date(0).toISOString(),
        })),
        vertices: {},
        edges: {},
        depths: fullyDefinedGraphResolveDepths,
      };

    for (const entityRevision of results) {
      traverseElement<false>({
        traversalSubgraph,
        datastore: graph,
        element: { kind: "entity", inner: entityRevision },
        elementIdentifier: {
          baseId: entityRevision.metadata.recordId.entityId,
          revisionId: new Date(0).toISOString(),
        },
        currentTraversalDepths: fullyDefinedGraphResolveDepths,
        interval: undefined,
      });
    }

    return {
      results: traversalSubgraph,
      operation: appliedOperation,
    } as QueryEntitiesReturn<Temporal>;
  } else {
    throw new InconsistentTemporalVersioningSupportError({
      getEntityData:
        (data as QueryEntitiesDataTemporal).temporalAxes !== undefined,
      datastoreGraph: isTemporalSubgraph(graph),
    });
  }
};
