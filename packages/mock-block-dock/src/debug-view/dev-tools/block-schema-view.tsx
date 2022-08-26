import { Box, Button } from "@mui/material";
import { ChangeEvent } from "react";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { JsonView } from "./json-view";

export const BlockSchemaView = () => {
  const { blockSchema, setBlockSchema } = useMockBlockDockContext();

  const handleUploadSchema = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.[0] && files?.[0].type === "application/json") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (typeof evt.target?.result !== "string") {
          return null;
        }

        const schema = JSON.parse(evt.target.result);
        // @todo validate loaded schema file

        // @todo consider persisting block-schema, perhaps to localstorage
        // so user doesn't have to load schema all the time
        setBlockSchema(schema);
      };
      reader.readAsText(files[0]);
    }
  };

  return blockSchema ? (
    <Box maxWidth={800}>
      <JsonView
        collapseKeys={Object.keys(blockSchema)}
        rootName="blockSchema"
        src={blockSchema}
      />
    </Box>
  ) : (
    <Button
      variant="outlined"
      size="small"
      aria-label="Upload Block Schema"
      component="label"
      sx={{ textTransform: "none" }}
      color="inherit"
    >
      <input hidden accept=".json" type="file" onChange={handleUploadSchema} />
      upload schema
    </Button>
  );
};
