import {
  EntityRootType as EntityRootTypeNonTemporal,
  GetEntityData as GetEntityDataNonTemporal,
  GraphResolveDepths,
  Subgraph as SubgraphNonTemporal,
} from "@blockprotocol/graph";
import { isTemporalSubgraph } from "@blockprotocol/graph/internal";
import { getEntityRevision as getEntityRevisionNonTemporal } from "@blockprotocol/graph/stdlib";
import {
  EntityRootType as EntityRootTypeTemporal,
  GetEntityData as GetEntityDataTemporal,
  Subgraph as SubgraphTemporal,
} from "@blockprotocol/graph/temporal";
import { getEntityRevision as getEntityRevisionTemporal } from "@blockprotocol/graph/temporal/stdlib";

import { InconsistentTemporalVersioningSupportError } from "../../../error";
import { resolveTemporalAxes } from "../../resolve-temporal-axes";
import {
  TraversalSubgraph as TraversalSubgraphNonTemporal,
  traverseElement as traverseElementNonTemporal,
} from "../../traverse/non-temporal";
import {
  finalizeSubgraph as finalizeSubgraphTemporal,
  TraversalSubgraph as TraversalSubgraphTemporal,
  traverseElement as traverseElementTemporal,
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

type GetEntityReturn<Temporal extends boolean> =
  | (Temporal extends true
      ? SubgraphTemporal<EntityRootTypeTemporal>
      : SubgraphNonTemporal<EntityRootTypeNonTemporal>)
  | undefined;

export const getEntity = <Temporal extends boolean>(
  data: GetEntityDataTemporal | GetEntityDataNonTemporal,
  graph: Temporal extends true ? SubgraphTemporal : SubgraphNonTemporal,
): GetEntityReturn<Temporal> => {
  if (
    // this cast should be safe because we're only checking if temporalAxes is defined
    (data as GetEntityDataTemporal).temporalAxes !== undefined &&
    isTemporalSubgraph(graph)
  ) {
    const {
      entityId,
      graphResolveDepths = {},
      temporalAxes,
    } = data as GetEntityDataTemporal;

    const fullyDefinedGraphResolveDepths = {
      ...defaultGraphResolveDepths,
      ...graphResolveDepths,
    };

    const resolvedTemporalAxes = resolveTemporalAxes(temporalAxes);

    const entityRevision = getEntityRevisionTemporal(graph, entityId);

    if (entityRevision === undefined) {
      return undefined as GetEntityReturn<Temporal>;
    }

    const traversalSubgraph: TraversalSubgraphTemporal<EntityRootTypeTemporal> =
      {
        roots: [
          {
            baseId: entityRevision.metadata.recordId.entityId,
            revisionId:
              entityRevision.metadata.temporalVersioning[
                resolvedTemporalAxes.variable.axis
              ].start.limit,
          },
        ],
        vertices: {},
        edges: {},
        depths: fullyDefinedGraphResolveDepths,
        temporalAxes: { initial: temporalAxes, resolved: resolvedTemporalAxes },
      };

    traverseElementTemporal({
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

    return finalizeSubgraphTemporal(
      traversalSubgraph,
    ) as GetEntityReturn<Temporal>;
  } else if (
    // this cast should be safe because we're only checking if temporalAxes is defined
    (data as GetEntityDataTemporal).temporalAxes === undefined &&
    !isTemporalSubgraph(graph)
  ) {
    const { entityId, graphResolveDepths = {} } =
      data as GetEntityDataNonTemporal;

    const fullyDefinedGraphResolveDepths = {
      ...defaultGraphResolveDepths,
      ...graphResolveDepths,
    };

    const entityRevision = getEntityRevisionNonTemporal(graph, entityId);

    if (entityRevision === undefined) {
      return undefined as GetEntityReturn<Temporal>;
    }

    const traversalSubgraph: TraversalSubgraphNonTemporal<EntityRootTypeNonTemporal> =
      {
        roots: [
          {
            baseId: entityRevision.metadata.recordId.entityId,
            revisionId: new Date(0).toISOString(),
          },
        ],
        vertices: {},
        edges: {},
        depths: fullyDefinedGraphResolveDepths,
      };

    traverseElementNonTemporal({
      traversalSubgraph,
      datastore: graph,
      element: { kind: "entity", inner: entityRevision },
      elementIdentifier: {
        baseId: entityRevision.metadata.recordId.entityId,
        revisionId: new Date(0).toISOString(),
      },
      currentTraversalDepths: fullyDefinedGraphResolveDepths,
    });

    return traversalSubgraph as GetEntityReturn<Temporal>;
  } else {
    throw new InconsistentTemporalVersioningSupportError({
      getEntityData: (data as GetEntityDataTemporal).temporalAxes !== undefined,
      datastoreGraph: isTemporalSubgraph(graph),
    });
  }
};
