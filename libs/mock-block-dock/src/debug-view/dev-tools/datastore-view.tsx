import { Box } from "@mui/material";

import {
  useMockBlockDockNonTemporalContext,
  useMockBlockDockTemporalContext,
} from "../../mock-block-dock-context";
import { DatastoreGraphVisualization } from "./datastore-graph-visualization";
import { JsonView } from "./json-view";

const DataStoreViewNonTemporal = () => {
  const { graph } = useMockBlockDockNonTemporalContext();
  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: {
          xs: "column-reverse",
          lg: "row",
        },
      }}
    >
      <JsonView
        collapseKeys={["vertices", "edges"]}
        rootName="datastore"
        src={{
          vertices: graph.vertices,
          edges: graph.edges,
        }}
      />
      <DatastoreGraphVisualization temporal={false} />
    </Box>
  );
};

const DataStoreViewTemporal = () => {
  const { graph } = useMockBlockDockTemporalContext();
  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: {
          xs: "column-reverse",
          lg: "row",
        },
      }}
    >
      <JsonView
        collapseKeys={["vertices", "edges"]}
        rootName="datastore"
        src={{
          vertices: graph.vertices,
          edges: graph.edges,
        }}
      />
      <DatastoreGraphVisualization temporal />
    </Box>
  );
};

export const DataStoreView = ({ temporal }: { temporal: boolean }) => {
  return temporal ? <DataStoreViewTemporal /> : <DataStoreViewNonTemporal />;
};
