import {
  Entity as EntityNonTemporal,
  EntityRevisionId as EntityRevisionIdNonTemporal,
  EntityVertex as EntityVertexNonTemporal,
  EntityVertexId as EntityVertexIdNonTemporal,
  GraphElementVertexId as GraphElementVertexIdNonTemporal,
  isEntityVertex as isEntityVertexNonTemporal,
  isHasRightEntityEdge as isHasRightEntityEdgeNonTemporal,
  isOutgoingLinkEdge as isOutgoingLinkEdgeNonTemporal,
  OutwardEdge as OutwardEdgeNonTemporal,
  Subgraph as SubgraphNonTemporal,
} from "@blockprotocol/graph";
import { isTemporalSubgraph } from "@blockprotocol/graph/internal";
import {
  getEntityTypeById as getEntityTypeByIdNonTemporal,
  getOutgoingLinkAndTargetEntities as getOutgoingLinkAndTargetEntitiesNonTemporal,
  getPropertyTypesByBaseUri as getPropertyTypesByBaseUriNonTemporal,
  getVertexIdForRecordId as getVertexIdForRecordIdNonTemporal,
} from "@blockprotocol/graph/stdlib";
import {
  Entity as EntityTemporal,
  EntityRevisionId as EntityRevisionIdTemporal,
  EntityVertex as EntityVertexTemporal,
  EntityVertexId as EntityVertexIdTemporal,
  GraphElementVertexId as GraphElementVertexIdTemporal,
  isEntityVertex as isEntityVertexTemporal,
  isHasRightEntityEdge as isHasRightEntityEdgeTemporal,
  isOutgoingLinkEdge as isOutgoingLinkEdgeTemporal,
  OutwardEdge as OutwardEdgeTemporal,
  Subgraph as SubgraphTemporal,
} from "@blockprotocol/graph/temporal";
import {
  getEntityTypeById as getEntityTypeByIdTemporal,
  getOutgoingLinkAndTargetEntities as getOutgoingLinkAndTargetEntitiesTemporal,
  getPropertyTypesByBaseUri as getPropertyTypesByBaseUriTemporal,
  getVertexIdForRecordId as getVertexIdForRecordIdTemporal,
  intervalOverlapsInterval,
} from "@blockprotocol/graph/temporal/stdlib";
import { Box } from "@mui/material";
import { GraphChart, GraphSeriesOption } from "echarts/charts";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import {
  GraphEdgeItemOption,
  GraphNodeItemOption,
} from "echarts/types/src/chart/graph/GraphSeries";
import { useEffect, useRef, useState } from "react";

import {
  useMockBlockDockNonTemporalContext,
  useMockBlockDockTemporalContext,
} from "../../mock-block-dock-context";
import { mustBeDefined, typedEntries, typedKeys } from "../../util";

const parseLabelFromEntity = (
  entityToLabel: EntityTemporal | EntityNonTemporal,
  subgraph: SubgraphTemporal | SubgraphNonTemporal,
) => {
  const getFallbackLabel = () => {
    // fallback to the entity type and a few characters of the entityId
    const entityId = entityToLabel.metadata.recordId.entityId;

    const entityType = isTemporalSubgraph(subgraph)
      ? getEntityTypeByIdTemporal(subgraph, entityToLabel.metadata.entityTypeId)
      : getEntityTypeByIdNonTemporal(
          subgraph,
          entityToLabel.metadata.entityTypeId,
        );
    const entityTypeName = entityType?.schema.title ?? "Entity";

    return `${entityTypeName}-${entityId.slice(0, 5)}`;
  };

  const getFallbackIfNotString = (val: any) => {
    if (!val || typeof val !== "string") {
      return getFallbackLabel();
    }

    return val;
  };

  // fallback to some likely display name properties
  const options = [
    "name",
    "preferred name",
    "display name",
    "title",
    "shortname",
  ];

  const propertyTypes: { title?: string; propertyTypeBaseUri: string }[] =
    Object.keys(entityToLabel.properties).map((propertyTypeBaseUri) => {
      /** @todo - pick the latest version, or the version in the entity type, rather than first element? */
      const [propertyType] = isTemporalSubgraph(subgraph)
        ? getPropertyTypesByBaseUriTemporal(subgraph, propertyTypeBaseUri)
        : getPropertyTypesByBaseUriNonTemporal(subgraph, propertyTypeBaseUri);

      return propertyType
        ? {
            title: propertyType.schema.title.toLowerCase(),
            propertyTypeBaseUri,
          }
        : {
            title: undefined,
            propertyTypeBaseUri,
          };
    });

  for (const option of options) {
    const found = propertyTypes.find(({ title }) => title === option);

    if (found) {
      return getFallbackIfNotString(
        entityToLabel.properties[found.propertyTypeBaseUri],
      );
    }
  }

  return getFallbackLabel();
};

type SeriesOption = GraphSeriesOption;

// Combine an Option type with only required components and charts via ComposeOption
type EChartOption = echarts.ComposeOption<SeriesOption>;

const createDefaultEChartOptions = (params?: {
  initialNodes?: GraphSeriesOption["nodes"];
  initialEdges?: GraphSeriesOption["edges"];
}): EChartOption => ({
  color: ["#6F59EB"],
  series: [
    {
      type: "graph",
      layout: "force",
      draggable: true,
      /** @todo: find way to get this working, currently interferes with `draggable` */
      // roam: true,
      force: {
        repulsion: 125,
        edgeLength: 150,
      },
      label: {
        fontSize: 16,
      },
      edgeLabel: {
        fontSize: 10,
      },
      nodes: params?.initialNodes,
      edges: params?.initialEdges,
      // The size of the Node
      symbolSize: 25,
      edgeSymbol: ["none", "arrow"],
    },
  ],
});

// Register the required components
echarts.use([GraphChart, SVGRenderer]);

type EChartNode = GraphNodeItemOption & { id: string };

const mapEntityToEChartNode = (
  entity: EntityNonTemporal | EntityTemporal,
  vertexId: EntityVertexIdNonTemporal | EntityVertexIdTemporal,
  subgraph: SubgraphNonTemporal | SubgraphTemporal,
): EChartNode => ({
  id: JSON.stringify(vertexId),
  name: parseLabelFromEntity(entity, subgraph),
  label: { show: false },
});

type EChartEdge = GraphEdgeItemOption & {
  target: string;
};

/** todo - render ontology-related edges */
const mapGraphEdgeToEChartEdge = (
  sourceVertexId: EntityVertexIdNonTemporal | EntityVertexIdTemporal,
  targetVertexId: EntityVertexIdNonTemporal | EntityVertexIdTemporal,
  edgeKind: (OutwardEdgeNonTemporal | OutwardEdgeTemporal)["kind"],
  edgeLabel: "has outgoing link" | "has target",
): EChartEdge => ({
  /** @todo - Can we do better than this, this assumes that this triple is unique, which it might not be */
  id: `${JSON.stringify(sourceVertexId)}-${edgeKind}->${JSON.stringify(
    targetVertexId,
  )}`,
  name: edgeLabel,
  source: JSON.stringify(sourceVertexId),
  target: JSON.stringify(targetVertexId),
  label: {
    show: false,
    formatter: edgeLabel,
  },
});

const getSubgraphEntitiesAsEChartNodes = (
  subgraph: SubgraphNonTemporal | SubgraphTemporal,
): EChartNode[] => {
  const entitiesAndVertexIds = isTemporalSubgraph(subgraph)
    ? typedEntries(subgraph.vertices).flatMap(([baseId, revisionObject]) =>
        typedEntries(revisionObject)
          .filter(
            (
              entry,
            ): entry is [EntityRevisionIdTemporal, EntityVertexTemporal] =>
              isEntityVertexTemporal(entry[1]),
          )
          .map(([revisionId, vertex]) => {
            return [vertex.inner, { baseId, revisionId }] as const;
          }),
      )
    : typedEntries(subgraph.vertices).flatMap(([baseId, revisionObject]) =>
        typedEntries(revisionObject)
          .filter(
            (
              entry,
            ): entry is [
              EntityRevisionIdNonTemporal,
              EntityVertexNonTemporal,
            ] => isEntityVertexNonTemporal(entry[1]),
          )
          .map(([revisionId, vertex]) => {
            return [vertex.inner, { baseId, revisionId }] as const;
          }),
      );

  /** @todo - Render link entities differently */
  // const [linkEntities, nonLinkEntities] = partitionArrayByCondition(
  //   entitiesAndVertexIds,
  //   ([entity, _]) =>
  //     entity.linkData?.leftEntityId !== undefined &&
  //     entity.linkData?.rightEntityId !== undefined,
  // );

  return entitiesAndVertexIds.map(([entity, entityVertexId]) =>
    mapEntityToEChartNode(entity, entityVertexId, subgraph),
  );
};

const getSubgraphEdgesAsEChartEdges = (
  subgraph: SubgraphNonTemporal | SubgraphTemporal,
): EChartEdge[] =>
  typedEntries(subgraph.edges).flatMap(([sourceBaseId, inner]) => {
    return typedEntries(inner).flatMap(([revisionId, outwardEdges]) => {
      return outwardEdges.flatMap((outwardEdge) => {
        const sourceRevisions = typedKeys(
          subgraph.vertices[sourceBaseId]!,
        ).filter((sourceRevisionId) => {
          return sourceRevisionId >= revisionId;
        });

        if (isTemporalSubgraph(subgraph)) {
          const outwardEdgeTemporal = outwardEdge as OutwardEdgeTemporal;
          const targetBaseId =
            "entityId" in outwardEdgeTemporal.rightEndpoint
              ? outwardEdgeTemporal.rightEndpoint.entityId
              : outwardEdgeTemporal.rightEndpoint.baseId;

          const targetVersions = typedEntries(
            mustBeDefined(subgraph.vertices[targetBaseId]),
          )
            .filter(([targetRevisionId, vertex]) => {
              if (
                typeof outwardEdgeTemporal === "object" &&
                "entityId" in outwardEdgeTemporal.rightEndpoint
              ) {
                if (!isEntityVertexTemporal(vertex)) {
                  throw new Error(
                    `Edge is supposed to point to entity vertex but found ${
                      vertex.kind
                    }: ${JSON.stringify(outwardEdgeTemporal)}`,
                  );
                }
                return intervalOverlapsInterval(
                  outwardEdgeTemporal.rightEndpoint.interval,
                  vertex.inner.metadata.temporalVersioning[
                    subgraph.temporalAxes.resolved.variable.axis
                  ],
                );
              } else {
                return (
                  "revisionId" in outwardEdgeTemporal.rightEndpoint &&
                  targetRevisionId >=
                    outwardEdgeTemporal.rightEndpoint.revisionId
                );
              }
            })
            .map(([targetRevisionId, _vertex]) => targetRevisionId);

          return sourceRevisions.flatMap((sourceRevisionId) =>
            targetVersions
              .flatMap((targetRevisionId) => {
                if (
                  isOutgoingLinkEdgeTemporal(outwardEdgeTemporal) ||
                  isHasRightEntityEdgeTemporal(outwardEdgeTemporal)
                ) {
                  const sourceVertexId: GraphElementVertexIdTemporal = {
                    baseId: sourceBaseId,
                    revisionId: sourceRevisionId,
                  };

                  const targetVertexId: GraphElementVertexIdTemporal = {
                    baseId: targetBaseId,
                    revisionId: targetRevisionId,
                  };

                  return mapGraphEdgeToEChartEdge(
                    sourceVertexId,
                    targetVertexId,
                    outwardEdge.kind,
                    isOutgoingLinkEdgeTemporal(outwardEdgeTemporal)
                      ? "has outgoing link"
                      : "has target",
                  );
                }
                return undefined;
              })
              .filter(
                (edge: EChartEdge | undefined): edge is EChartEdge =>
                  edge !== undefined,
              ),
          );
        } else {
          const outwardEdgeTemporal = outwardEdge as OutwardEdgeNonTemporal;
          if (typeof outwardEdgeTemporal.rightEndpoint !== "string") {
            return [];
          }
          const targetBaseId = outwardEdgeTemporal.rightEndpoint;

          if (
            isOutgoingLinkEdgeNonTemporal(outwardEdgeTemporal) ||
            isHasRightEntityEdgeNonTemporal(outwardEdgeTemporal)
          ) {
            const sourceVertexId: GraphElementVertexIdNonTemporal = {
              baseId: sourceBaseId,
              revisionId: Object.keys(subgraph.vertices[sourceBaseId]!).pop()!,
            };

            const targetVertexId: GraphElementVertexIdNonTemporal = {
              baseId: targetBaseId,
              revisionId: Object.keys(subgraph.vertices[targetBaseId]!).pop()!,
            };

            return mapGraphEdgeToEChartEdge(
              sourceVertexId,
              targetVertexId,
              outwardEdge.kind,
              isOutgoingLinkEdgeNonTemporal(outwardEdgeTemporal)
                ? "has outgoing link"
                : "has target",
            );
          }
          return [];
        }
      });
    });
  });

const DataStoreGraphVisualizationComponent = ({
  graph,
}: {
  graph: SubgraphTemporal | SubgraphNonTemporal;
}) => {
  const eChartWrapperRef = useRef<HTMLDivElement>(null);

  const [chart, setChart] = useState<echarts.ECharts>();

  useEffect(() => {
    const resizeChart = () => {
      if (chart) {
        chart.resize();
      }
    };

    window.addEventListener("resize", resizeChart);
    return () => {
      window.removeEventListener("resize", resizeChart);
    };
  }, [chart]);

  /** @todo - Render ontology elements */
  const [eChartNodes, setEChartNodes] = useState<EChartNode[]>(
    getSubgraphEntitiesAsEChartNodes(graph),
  );

  /** todo - render ontology-related edges */
  const [eChartEdges, setEChartEdges] = useState<EChartEdge[]>(
    getSubgraphEdgesAsEChartEdges(graph),
  );

  useEffect(() => {
    setEChartNodes(getSubgraphEntitiesAsEChartNodes(graph));
  }, [graph]);

  useEffect(() => {
    setEChartEdges(getSubgraphEdgesAsEChartEdges(graph));
  }, [graph]);

  const [selectedEntityVertexIdString, setSelectedEntityVertexIdString] =
    useState<string>();

  useEffect(() => {
    if (chart) {
      chart.setOption<EChartOption>({ series: [{ nodes: eChartNodes }] });
    }
  }, [chart, eChartNodes]);

  useEffect(() => {
    if (chart) {
      chart.setOption<EChartOption>({ series: [{ edges: eChartEdges }] });
    }
  }, [chart, eChartEdges]);

  useEffect(() => {
    if (chart && selectedEntityVertexIdString) {
      const outgoingLinkAndTargetEntities = isTemporalSubgraph(graph)
        ? getOutgoingLinkAndTargetEntitiesTemporal(
            graph,
            (JSON.parse(selectedEntityVertexIdString) as EntityVertexIdTemporal)
              .baseId,
          )
        : getOutgoingLinkAndTargetEntitiesNonTemporal(
            graph,
            (
              JSON.parse(
                selectedEntityVertexIdString,
              ) as EntityVertexIdNonTemporal
            ).baseId,
          );

      const getVertexIdForRecordId = isTemporalSubgraph(graph)
        ? getVertexIdForRecordIdTemporal
        : getVertexIdForRecordIdNonTemporal;

      const neighbourIds = outgoingLinkAndTargetEntities.flatMap(
        ({ linkEntity, rightEntity }) => {
          return [
            getVertexIdForRecordId(
              graph as SubgraphTemporal & SubgraphNonTemporal,
              (Array.isArray(linkEntity) ? linkEntity[0]! : linkEntity).metadata
                .recordId,
            ),
            JSON.stringify(
              getVertexIdForRecordId(
                graph as SubgraphTemporal & SubgraphNonTemporal,
                (Array.isArray(rightEntity) ? rightEntity[0]! : rightEntity)
                  .metadata.recordId,
              ),
            ),
          ];
        },
      );

      const nodesWithVisibleLabelsIds = [
        selectedEntityVertexIdString,
        ...neighbourIds,
      ];

      // Display the label of the selected node and neighbouring nodes
      setEChartNodes((prev) =>
        prev.map((node) => ({
          ...node,
          label: {
            ...node.label,
            show: nodesWithVisibleLabelsIds.includes(node.id),
          },
        })),
      );

      // Display the label of the outgoing links of the selected node
      setEChartEdges((prev) =>
        prev.map((edge) => ({
          ...edge,
          label: { ...edge.label, show: neighbourIds.includes(edge.target) },
        })),
      );
    }
  }, [chart, graph, selectedEntityVertexIdString]);

  useEffect(() => {
    if (!chart && eChartWrapperRef.current) {
      const initialisedChart = echarts.init(eChartWrapperRef.current);

      initialisedChart.on("click", { dataType: "node" }, ({ data: node }) =>
        setSelectedEntityVertexIdString((node as EChartNode).id),
      );

      const initialOptions = createDefaultEChartOptions();

      initialisedChart.setOption(initialOptions, { notMerge: true });

      setChart(initialisedChart);
    }
  }, [chart, eChartWrapperRef]);

  return (
    <Box
      sx={{
        width: "100%",
        height: 500,
      }}
      ref={eChartWrapperRef}
    />
  );
};

export const DatastoreGraphVisualizationTemporal = () => {
  const { graph } = useMockBlockDockTemporalContext();
  return <DataStoreGraphVisualizationComponent graph={graph} />;
};

export const DatastoreGraphVisualizationNonTemporal = () => {
  const { graph } = useMockBlockDockNonTemporalContext();
  return <DataStoreGraphVisualizationComponent graph={graph} />;
};

export const DatastoreGraphVisualization = ({
  temporal,
}: {
  temporal: boolean;
}) =>
  temporal ? (
    <DatastoreGraphVisualizationTemporal />
  ) : (
    <DatastoreGraphVisualizationNonTemporal />
  );
