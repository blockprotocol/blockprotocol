import { Box } from "@mui/material";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { DatastoreGraphVisualization } from "./datastore-graph-visualization";
import { JsonView } from "./json-view";

export const DataStoreView = () => {
  const { graph } = useMockBlockDockContext();
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
      <DatastoreGraphVisualization />
    </Box>
  );
};
