import { EntityType } from "@blockprotocol/graph";
import { Entity, Link } from "@blockprotocol/graph/.";
import { Box } from "@mui/material";
import { GraphChart, GraphSeriesOption } from "echarts/charts";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { useEffect, useRef, useState } from "react";

import { useMockBlockDockContext } from "../../mock-block-dock-context";

const parseLabelFromEntity =
  (type?: EntityType) =>
  (entity: Entity): string => {
    // if the schema has a labelProperty set, prefer that
    const labelProperty = type?.schema?.labelProperty;
    if (
      labelProperty &&
      typeof entity.properties[labelProperty] === "string" &&
      entity.properties[labelProperty]
    ) {
      return entity.properties[labelProperty] as string;
    }

    // fallback to some likely display name properties
    const options = [
      "name",
      "preferredName",
      "displayName",
      "title",
      "shortname",
    ];
    for (const option of options) {
      if (typeof entity.properties[option] === "string") {
        return entity.properties[option] as string;
      }
    }

    const entityTypeName = type?.schema?.title ?? "Entity";

    return `${entityTypeName}-${entity.entityId.slice(0, 5)}`;
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

const mapEntityToEChartNode =
  (entityTypes: EntityType[]) =>
  (entity: Entity): EChartNode => ({
    id: entity.entityId,
    name: parseLabelFromEntity(
      entityTypes.find((type) => type.entityTypeId === entity.entityTypeId),
    )(entity),
    label: { show: false },
  });

type EChartEdge = {
  id: string;
  source: string;
  target: string;
  label: {
    show?: boolean;
    formatter?: string;
  };
};

const mapLinkToEChartEdge = ({
  linkId,
  sourceEntityId,
  destinationEntityId,
  path,
}: Link): EChartEdge => ({
  id: linkId,
  source: sourceEntityId,
  target: destinationEntityId,
  label: { show: false, formatter: path.replace("$.", "") },
});

export const DatastoreGraphVisualisation = () => {
  const { datastore } = useMockBlockDockContext();

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

  const { entities, entityTypes, links } = datastore;

  const [eChartNodes, setEChartNodes] = useState<EChartNode[]>(
    entities.map(mapEntityToEChartNode(entityTypes)),
  );

  const [eChartEdges, setEChartEdges] = useState<EChartEdge[]>(
    links.map(mapLinkToEChartEdge),
  );

  useEffect(() => {
    setEChartNodes(entities.map(mapEntityToEChartNode(entityTypes)));
  }, [entities, entityTypes]);

  useEffect(() => {
    setEChartEdges(links.map(mapLinkToEChartEdge));
  }, [links]);

  const [selectedEntityId, setSelectedEntityId] = useState<string>();

  /** @todo: un-comment if we want to display something about the currently selected entity */
  // const selectedEntity = useMemo(
  //   () => entities.find(({ entityId }) => entityId === selectedEntityId),
  //   [entities, selectedEntityId],
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
    if (chart && selectedEntityId) {
      const outgoingLinks = links.filter(
        ({ sourceEntityId }) => sourceEntityId === selectedEntityId,
      );

      const outgoingLinkIds = outgoingLinks.map(({ linkId }) => linkId);

      const neighbourIds = outgoingLinks.map(
        ({ destinationEntityId }) => destinationEntityId,
      );

      const nodesWithVisibleLabelsIds = [selectedEntityId, ...neighbourIds];

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
          label: { ...edge.label, show: outgoingLinkIds.includes(edge.id) },
        })),
      );
    }
  }, [chart, selectedEntityId, links, entities]);

  useEffect(() => {
    if (!chart && eChartWrapperRef.current) {
      const initialisedChart = echarts.init(eChartWrapperRef.current);

      initialisedChart.on("click", { dataType: "node" }, ({ data: node }) =>
        setSelectedEntityId((node as EChartNode).id),
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
