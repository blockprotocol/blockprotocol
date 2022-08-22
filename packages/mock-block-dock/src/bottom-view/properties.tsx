import { BlockGraphProperties } from "@blockprotocol/graph";
import { Entity } from "@blockprotocol/graph/.";
import { Box, Grid, Switch } from "@mui/material";
import { Validator } from "jsonschema";
import { Dispatch, SetStateAction, useState } from "react";

import { JsonView } from "../json-view";

type Props = {
  blockEntity?: BlockGraphProperties<any>["graph"]["blockEntity"];
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  setBlockEntity: (entity: Entity) => void;
};

export const PropertiesView = ({
  readonly,
  blockEntity,
  setReadonly,
  setBlockEntity,
}: Props) => {
  const [schema, setSchema] = useState(null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} textAlign="right" alignSelf="center">
        Read-only mode
      </Grid>
      <Grid item xs={9}>
        <Switch
          checked={readonly}
          onChange={(evt) => setReadonly(evt.target.checked)}
        />
      </Grid>
      <Grid item xs={3} textAlign="right">
        Block Entity Properties
      </Grid>
      <Grid item xs={9}>
        <Box maxWidth={800}>
          <JsonView
            collapseKeys={["graph"]}
            rootName="blockEntity"
            src={blockEntity ?? {}}
            // onEdit={(edit) => {
            //   setBlockEntity(edit.updated_src);
            //   console.log(edit);
            // }}
            // onAdd={(add) => {
            //   console.log(add);
            // }}
            // onDelete={(args) => {
            //   console.log(args);
            // }}
          />
        </Box>
      </Grid>
      <Grid item xs={3} textAlign="right">
        Block Schema
      </Grid>
      <Grid item xs={9}>
        <Box maxWidth={800}>
          {schema ? (
            <Box maxWidth={800}>
              <JsonView
                collapseKeys={Object.keys(schema)}
                rootName="blockSchema"
                src={schema}
              />
            </Box>
          ) : (
            <input
              type="file"
              id="load-schema"
              name="load schema"
              accept=".json"
              onChange={(event) => {
                const files = event.target.files;
                if (files?.[0] && files?.[0].type === "application/json") {
                  console.log(files[0]);
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    if (typeof evt.target?.result !== "string") {
                      return null; // throw an error
                    }
                    const schema = JSON.parse(evt.target.result);
                    setSchema(schema);
                  };

                  reader.readAsText(files[0]);
                }
              }}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
