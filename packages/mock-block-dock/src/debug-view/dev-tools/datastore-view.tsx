import { Entity, Link } from "@blockprotocol/graph/.";
import { GraphChart, GraphSeriesOption } from "echarts/charts";
import { GridComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { useEffect, useRef, useState } from "react";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { JsonView } from "./json-view";

const parseNameFromEntity = (entity: Entity): string =>
  typeof entity.properties.name === "string"
    ? entity.properties.name
    : entity.entityId;

const graphHeight = 500;

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
        fontSize: 12,
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
echarts.use([GraphChart, GridComponent, SVGRenderer]);

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

const mapEntityToEChartNode = (entity: Entity): EChartNode => ({
  id: entity.entityId,
  name: parseNameFromEntity(entity),
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
  label: { show: false, formatter: path },
});

const GraphView = () => {
  const { datastore } = useMockBlockDockContext();

  const eChartWrapperRef = useRef<HTMLDivElement>(null);

  const [graphWidth, setGraphWidth] = useState<number>(0);

  useEffect(() => {
    const updateGraphWidth = () => {
      if (eChartWrapperRef.current) {
        setGraphWidth(eChartWrapperRef.current?.clientWidth);
      }
    };

    updateGraphWidth();

    window.addEventListener("resize", updateGraphWidth);
    return () => {
      window.removeEventListener("resize", updateGraphWidth);
    };
  }, [eChartWrapperRef]);

  const [chart, setChart] = useState<echarts.ECharts>();

  const { entities, links } = datastore;

  const [eChartNodes, setEChartNodes] = useState<EChartNode[]>(
    entities.map(mapEntityToEChartNode),
  );

  const [eChartEdges, setEChartEdges] = useState<EChartEdge[]>(
    links.map(mapLinkToEChartEdge),
  );

  useEffect(() => {
    setEChartNodes(entities.map(mapEntityToEChartNode));
  }, [entities]);

  useEffect(() => {
    setEChartEdges(links.map(mapLinkToEChartEdge));
  }, [links]);

  const [selectedEntityId, setSelectedEntityId] = useState<string>();

  // const selectedEntity = useMemo(
  //   () => entities.find(({ entityId }) => entityId === selectedEntityId),
  //   [entities, selectedEntityId],
  // );

  useEffect(() => {
    if (chart) {
      chart.setOption<EChartOption>({
        series: [{ nodes: eChartNodes, edges: eChartEdges }],
      });
    }
  }, [chart, eChartNodes, eChartEdges]);

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

      setEChartEdges((prev) =>
        prev.map((edge) => ({
          ...edge,
          label: { ...edge.label, show: outgoingLinkIds.includes(edge.id) },
        })),
      );
      setEChartNodes((prev) =>
        prev.map((node) => ({
          ...node,
          label: {
            ...node.label,
            show: nodesWithVisibleLabelsIds.includes(node.id),
          },
        })),
      );
    }
  }, [chart, selectedEntityId, graphWidth, links, entities]);

  useEffect(() => {
    if (eChartWrapperRef.current) {
      const initialisedChart = echarts.init(eChartWrapperRef.current);

      initialisedChart.on("click", { dataType: "node" }, ({ data: node }) => {
        setEChartNodes((prev) => {
          const index = prev.findIndex(
            ({ id }) => id === (node as EChartNode).id,
          );

          return [
            ...prev.slice(0, index),
            { ...(prev[index] as any), label: { show: false } },
            ...prev.slice(index + 1),
          ];
        });
        setSelectedEntityId((node as EChartNode).id);
      });

      const initialOptions = createDefaultEChartOptions();

      initialisedChart.setOption(initialOptions, { notMerge: true });

      setChart(initialisedChart);
    }
  }, [eChartWrapperRef]);

  return (
    <div
      style={{ width: "100%", height: graphHeight }}
      ref={eChartWrapperRef}
    />
  );
};

export const DataStoreView = () => {
  const { datastore } = useMockBlockDockContext();
  return (
    <>
      <GraphView />
      <JsonView
        collapseKeys={[
          "entities",
          "entityTypes",
          "links",
          "linkedAggregations",
        ]}
        rootName="datastore"
        src={{
          entities: datastore.entities,
          entityTypes: datastore.entityTypes,
          links: datastore.links,
          linkedAggregations: datastore.linkedAggregationDefinitions,
        }}
      />
    </>
  );
};
