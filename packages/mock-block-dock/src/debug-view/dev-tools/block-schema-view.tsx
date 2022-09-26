import { Box } from "@mui/material";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { JsonView } from "./json-view";

export const BlockSchemaView = () => {
  const { blockSchema } = useMockBlockDockContext();

  if (!blockSchema) {
    return null;
  }

  return (
    <Box maxWidth={800}>
      <JsonView
        collapseKeys={Object.keys(blockSchema)}
        rootName="blockSchema"
        src={blockSchema}
      />
    </Box>
  );
};
