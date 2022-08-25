import { Entity } from "@blockprotocol/graph";
import {
  Box,
  Collapse,
  Container,
  Grid,
  Switch,
  Typography
} from "@mui/material";
import Ajv from "ajv";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { BlockSchemaView } from "./block-schema-view";
import { JsonView } from "./json-view";

const ajv = new Ajv();

export const PropertiesView = () => {
  const {
    readonly,
    setReadonly,
    blockSchema,
    blockEntity,
    setBlockEntity
  } = useMockBlockDockContext();
  const validate = ajv.compile(blockSchema ?? {});
  validate(blockEntity);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={4}>
        <Grid item xs={6}>
          {/* Entity Properties row */}
          <Box mb={3}>
            <Typography variant="subtitle2" mb={1}>
              Entity Properties
            </Typography>
            <Box maxWidth={800}>
              <JsonView
                collapseKeys={["graph"]}
                rootName="blockEntity"
                src={blockEntity ?? {}}
                onEdit={args => {
                  setBlockEntity(
                    args.updated_src as Entity<Record<string, unknown>>
                  );
                }}
                onAdd={args => {
                  setBlockEntity(
                    args.updated_src as Entity<Record<string, unknown>>
                  );
                }}
                onDelete={args => {
                  // entityType and entityId can be edited but should not be
                  // deleted
                  if (
                    args.name &&
                    ["entityType", "entityId", "properties"].includes(args.name)
                  ) {
                    return false;
                  }
                  setBlockEntity(
                    args.updated_src as Entity<Record<string, unknown>>
                  );
                }}
                validationMessage={validate.errors?.[0]?.message ?? ""}
              />
              <Collapse in={!!validate.errors?.length}>
                {validate.errors?.map(error => (
                  <Box key={error.message}>{JSON.stringify(error.message)}</Box>
                ))}
              </Collapse>
            </Box>
          </Box>

          {/* Readonly row */}
          <Box>
            <Typography variant="subtitle2">Read-only mode</Typography>
            <Switch
              checked={readonly}
              onChange={evt => setReadonly(evt.target.checked)}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Typography variant="subtitle2" mb={1}>
              {" "}
              Block Schema
            </Typography>
            <BlockSchemaView />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
