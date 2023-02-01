import {
  Entity,
  EntityRecordId,
  EntityVertexId,
  GraphElementVertexId,
  isHasRightEntityEdge,
  isOutgoingLinkEdge,
  OutwardEdge,
  Subgraph,
} from "@blockprotocol/graph";
import {
  getEntities,
  getEntityTypeById,
  getOutgoingLinkAndTargetEntities,
  getPropertyTypesByBaseUri,
} from "@blockprotocol/graph/stdlib";
import { Box } from "@mui/material";
import { GraphChart, GraphSeriesOption } from "echarts/charts";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { useEffect, useRef, useState } from "react";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { typedEntries } from "../../util";

const parseLabelFromEntity = (entityToLabel: Entity, subgraph: Subgraph) => {
  const getFallbackLabel = () => {
    // fallback to the entity type and a few characters of the entityUuid
    const entityId = entityToLabel.metadata.recordId.entityId;

    const entityType = getEntityTypeById(
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
      const [propertyType] = getPropertyTypesByBaseUri(
        subgraph,
        propertyTypeBaseUri,
      );

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

type EChartNode = {
  id: string;
  name: string;
  fixed?: boolean;
  x?: number;
  y?: number;
  label: {
    show?: boolean;
  };
};

const mapEntityToEChartNode = (
  entity: Entity,
  subgraph: Subgraph,
): EChartNode => ({
  id: JSON.stringify(entity.metadata.recordId),
  name: parseLabelFromEntity(entity, subgraph),
  label: { show: false },
});

type EChartEdge = {
  id: string;
  source: string;
  target: string;
  kind: string;
  label: {
    show?: boolean;
  };
};

/** todo - render ontology-related edges */
const mapGraphEdgeToEChartEdge = (
  sourceVertexId: EntityVertexId,
  targetVertexId: EntityVertexId,
  edgeKind: OutwardEdge["kind"],
): EChartEdge => ({
  /** @todo - Can we do better than this, this assumes that this triple is unique, which it might not be */
  id: `${JSON.stringify(sourceVertexId)}-${edgeKind}->${JSON.stringify(
    targetVertexId,
  )}`,
  source: JSON.stringify(sourceVertexId),
  target: JSON.stringify(targetVertexId),
  kind: edgeKind,
  label: { show: false },
});

const getSubgraphEntitiesAsEChartNodes = (subgraph: Subgraph): EChartNode[] => {
  const allEntities = getEntities(subgraph);

  /** @todo - Render link entities differently */
  // const [linkEntities, nonLinkEntities] = partitionArrayByCondition(
  //   allEntities,
  //   (entity) =>
  //     entity.linkData?.leftEntityId !== undefined &&
  //     entity.linkData?.rightEntityId !== undefined,
  // );

  return allEntities.map((entity) => mapEntityToEChartNode(entity, subgraph));
};

const getSubgraphEdgesAsEChartEdges = (subgraph: Subgraph): EChartEdge[] =>
  typedEntries(subgraph.edges).flatMap(([sourceBaseId, inner]) => {
    return typedEntries(inner).flatMap(([revisionId, outwardEdges]) => {
      return outwardEdges.flatMap((outwardEdge) => {
        /** @todo - This is quite hacky (and not entirely correct) at the moment, we need to consider end intervals */
        const sourceRevisions = Object.keys(
          subgraph.vertices[sourceBaseId]!,
        ).filter((sourceRevisionId) => {
          return sourceRevisionId >= revisionId;
        });

        const targetVersions = Object.keys(
          subgraph.vertices[outwardEdge.rightEndpoint.baseId]!,
        ).filter((targetRevisionId) => {
          const startRevisionId =
            "revisionId" in outwardEdge.rightEndpoint
              ? outwardEdge.rightEndpoint.revisionId
              : outwardEdge.rightEndpoint.timestamp;
          return targetRevisionId >= startRevisionId;
        });

        return sourceRevisions.flatMap((sourceRevisionId) =>
          targetVersions
            .flatMap((targetRevisionId) => {
              const sourceVertexId: GraphElementVertexId = {
                baseId: sourceBaseId,
                revisionId: sourceRevisionId,
              };

              const targetVertexId: GraphElementVertexId = {
                baseId: outwardEdge.rightEndpoint.baseId,
                revisionId: targetRevisionId,
              };

              if (isOutgoingLinkEdge(outwardEdge)) {
                return mapGraphEdgeToEChartEdge(
                  sourceVertexId,
                  targetVertexId,
                  outwardEdge.kind,
                );
              } else if (isHasRightEntityEdge(outwardEdge)) {
                return mapGraphEdgeToEChartEdge(
                  sourceVertexId,
                  targetVertexId,
                  outwardEdge.kind,
                );
              }
              return undefined;
            })
            .filter(
              (edge: EChartEdge | undefined): edge is EChartEdge =>
                edge !== undefined,
            ),
        );
      });
    });
  });

export const DatastoreGraphVisualization = () => {
  const { graph } = useMockBlockDockContext();

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

  const [selectedEntityRecordIdString, setSelectedEntityRecordIdString] =
    useState<string>();

  /** @todo: un-comment if we want to display something about the currently selected entity */
  // const selectedEntity = useMemo(
  //   () => entities.find(({ entityId }) => entityId === selectedEntityRecordIdString),
  //   [entities, selectedEntityRecordIdString],
  // );

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
    if (chart && selectedEntityRecordIdString) {
      const outgoingLinkAndTargetEntities = getOutgoingLinkAndTargetEntities(
        graph,
        (JSON.parse(selectedEntityRecordIdString) as EntityRecordId).entityId,
      );

      const neighbourIds = outgoingLinkAndTargetEntities.flatMap(
        ({ linkEntity, rightEntity }) => [
          JSON.stringify(linkEntity.metadata.recordId),
          JSON.stringify(rightEntity.metadata.recordId),
        ],
      );

      const nodesWithVisibleLabelsIds = [
        selectedEntityRecordIdString,
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
  }, [chart, graph, selectedEntityRecordIdString]);

  useEffect(() => {
    if (!chart && eChartWrapperRef.current) {
      const initialisedChart = echarts.init(eChartWrapperRef.current);

      initialisedChart.on("click", { dataType: "node" }, ({ data: node }) =>
        setSelectedEntityRecordIdString((node as EChartNode).id),
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
