import { Entity } from "@blockprotocol/graph";
import { Box, Collapse, Grid, Switch } from "@mui/material";
import Ajv from "ajv";

import { JsonView } from "../json-view";
import { useMockBlockDockContext } from "../mock-block-dock-context";
import { BlockSchemaView } from "./block-schema-view";

const ajv = new Ajv();

export const PropertiesView = () => {
  const { readonly, setReadonly, blockSchema, blockEntity, setBlockEntity } =
    useMockBlockDockContext();
  const validate = ajv.compile(blockSchema ?? {});
  validate(blockEntity);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            {/* Entity Properties row */}
            <Grid item xs={3} textAlign="right">
              Entity Properties
            </Grid>
            <Grid item xs={9}>
              <Box maxWidth={800}>
                <JsonView
                  collapseKeys={["graph"]}
                  rootName="blockEntity"
                  src={blockEntity ?? {}}
                  onEdit={(args) => {
                    setBlockEntity(
                      args.updated_src as Entity<Record<string, unknown>>,
                    );
                  }}
                  onAdd={(args) => {
                    setBlockEntity(
                      args.updated_src as Entity<Record<string, unknown>>,
                    );
                  }}
                  onDelete={(args) => {
                    setBlockEntity(
                      args.updated_src as Entity<Record<string, unknown>>,
                    );
                  }}
                  validationMessage={validate.errors?.[0]?.message ?? ""}
                />
                <Collapse in={!!validate.errors?.length}>
                  {validate.errors?.map((error) => (
                    <Box key={error.message}>
                      {JSON.stringify(error.message)}
                    </Box>
                  ))}
                </Collapse>
              </Box>
            </Grid>
            {/* Readonly row */}
            <Grid item xs={3} textAlign="right" alignSelf="center">
              Read-only mode
            </Grid>
            <Grid item xs={9}>
              <Switch
                checked={readonly}
                onChange={(evt) => setReadonly(evt.target.checked)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2} alignItems="flex-start">
            {/* Block Schema row */}
            <Grid item xs={3} textAlign="right">
              Block Schema
            </Grid>
            <Grid item xs={9}>
              <BlockSchemaView />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
