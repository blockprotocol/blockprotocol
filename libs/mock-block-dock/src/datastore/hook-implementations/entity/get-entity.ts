import {
  EntityRootType,
  GetEntityData,
  GraphResolveDepths,
  Subgraph,
} from "@blockprotocol/graph";
import { getEntityRevision } from "@blockprotocol/graph/stdlib";

import { getDefaultTemporalAxes } from "../../get-default-temporal-axes";
import { resolveTemporalAxes } from "../../resolve-temporal-axes";
import {
  finalizeSubgraph,
  TraversalSubgraph,
  traverseElement,
} from "../../traverse";

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

export const getEntityImpl = (
  {
    entityId,
    graphResolveDepths = defaultGraphResolveDepths,
    temporalAxes,
  }: GetEntityData<true>,
  graph: Subgraph<true>,
): Subgraph<true, EntityRootType<true>> | undefined => {
  const resolvedTemporalAxes = resolveTemporalAxes(temporalAxes);

  const entityRevision = getEntityRevision(graph, entityId);

  if (entityRevision === undefined) {
    return undefined;
  }

  const fullyDefinedGraphResolveDepths = {
    ...defaultGraphResolveDepths,
    ...graphResolveDepths,
  };

  const traversalSubgraph: TraversalSubgraph<true, EntityRootType<true>> = {
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

  return finalizeSubgraph(traversalSubgraph);
};

export const getEntity = <Temporal extends boolean>(
  data: GetEntityData<Temporal>,
  graph: Subgraph<true>,
): Subgraph<Temporal, EntityRootType<Temporal>> | undefined => {
  // this cast is safe as we're only checking against undefined
  if ((data as GetEntityData<true>).temporalAxes !== undefined) {
    return getEntityImpl(data as GetEntityData<true>, graph) as
      | Subgraph<Temporal, EntityRootType<Temporal>>
      | undefined;
  } else {
    return getEntityImpl(
      {
        ...(data as GetEntityData<false>),
        temporalAxes: getDefaultTemporalAxes(),
      },
      graph,
    ) as Subgraph<Temporal, EntityRootType<Temporal>> | undefined;
  }
};
