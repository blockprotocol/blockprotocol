import { EntityType } from "@blockprotocol/graph";
import { Box } from "@mui/material";

import { JsonView } from "./json-view";

export const BlockSchemaView = ({ entityType }: { entityType: EntityType }) => {
  return (
    <Box maxWidth={800}>
      <JsonView
        collapseKeys={Object.keys(entityType)}
        rootName="blockSchema"
        src={entityType}
      />
    </Box>
  );
};
