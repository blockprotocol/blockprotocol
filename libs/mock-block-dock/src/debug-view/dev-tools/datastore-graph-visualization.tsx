import {
  Entity,
  EntityEditionId,
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
    const entityId = entityToLabel.metadata.editionId.baseId;

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
  id: JSON.stringify(entity.metadata.editionId),
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
  sourceEditionId: EntityEditionId,
  targetEditionId: EntityEditionId,
  edgeKind: OutwardEdge["kind"],
): EChartEdge => ({
  /** @todo - Can we do better than this, this assumes that this triple is unique, which it might not be */
  id: `${JSON.stringify(sourceEditionId)}-${edgeKind}->${JSON.stringify(
    targetEditionId,
  )}`,
  source: JSON.stringify(sourceEditionId),
  target: JSON.stringify(targetEditionId),
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
    return typedEntries(inner).flatMap(([momentIdentifier, outwardEdges]) => {
      return outwardEdges.flatMap((outwardEdge) => {
        /** @todo - This is quite hacky (and not entirely correct) at the moment, we need to consider end intervals */
        const sourceVersions = Object.keys(
          subgraph.vertices[sourceBaseId]!,
        ).filter((version) => {
          return version >= momentIdentifier;
        });

        const targetVersions = Object.keys(
          subgraph.vertices[outwardEdge.rightEndpoint.baseId]!,
        ).filter((version) => {
          const startVersion =
            "versionId" in outwardEdge.rightEndpoint
              ? outwardEdge.rightEndpoint.versionId
              : outwardEdge.rightEndpoint.timestamp;
          return version >= startVersion;
        });

        return sourceVersions.flatMap((sourceVersion) =>
          targetVersions
            .flatMap((targetVersion) => {
              const sourceEditionId = {
                baseId: sourceBaseId,
                versionId: sourceVersion,
              };

              const targetEditionId = {
                baseId: outwardEdge.rightEndpoint.baseId,
                versionId: targetVersion,
              };

              if (isOutgoingLinkEdge(outwardEdge)) {
                return mapGraphEdgeToEChartEdge(
                  sourceEditionId,
                  targetEditionId,
                  outwardEdge.kind,
                );
              } else if (isHasRightEntityEdge(outwardEdge)) {
                return mapGraphEdgeToEChartEdge(
                  sourceEditionId,
                  targetEditionId,
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

  const [selectedEntityEditionIdString, setSelectedEntityEditionIdString] =
    useState<string>();

  /** @todo: un-comment if we want to display something about the currently selected entity */
  // const selectedEntity = useMemo(
  //   () => entities.find(({ entityId }) => entityId === selectedEntityEditionIdString),
  //   [entities, selectedEntityEditionIdString],
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
    if (chart && selectedEntityEditionIdString) {
      const outgoingLinkAndTargetEntities = getOutgoingLinkAndTargetEntities(
        graph,
        (JSON.parse(selectedEntityEditionIdString) as EntityEditionId).baseId,
      );

      const neighbourIds = outgoingLinkAndTargetEntities.flatMap(
        ({ linkEntity, rightEntity }) => [
          JSON.stringify(linkEntity.metadata.editionId),
          JSON.stringify(rightEntity.metadata.editionId),
        ],
      );

      const nodesWithVisibleLabelsIds = [
        selectedEntityEditionIdString,
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
  }, [chart, graph, selectedEntityEditionIdString]);

  useEffect(() => {
    if (!chart && eChartWrapperRef.current) {
      const initialisedChart = echarts.init(eChartWrapperRef.current);

      initialisedChart.on("click", { dataType: "node" }, ({ data: node }) =>
        setSelectedEntityEditionIdString((node as EChartNode).id),
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