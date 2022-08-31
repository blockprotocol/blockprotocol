import { Entity } from "@blockprotocol/graph";
import {
  Box,
  Collapse,
  Container,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import Ajv from "ajv";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { customColors } from "../theme/palette";
import { BlockSchemaView } from "./block-schema-view";
import { EntitySwitcher } from "./entity-switcher";
import { JsonView } from "./json-view";

const ajv = new Ajv();

export const PropertiesView = () => {
  const { readonly, setReadonly, blockSchema, blockEntity, setBlockEntity } =
    useMockBlockDockContext();

  const validate = ajv.compile(blockSchema ?? {});
  validate(blockEntity.properties);
  const errors = validate.errors?.map((error) => error.message);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={4}>
        <Grid item xs={6}>
          {/* Entity Properties row */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle2">Entity Properties</Typography>
              <EntitySwitcher />
            </Box>

            <Box maxWidth={800}>
              <JsonView
                collapseKeys={["graph"]}
                rootName="blockEntity"
                sortKeys
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
                  // entityType,entityTypeId and entityId can be edited but should not be
                  // deleted
                  if (
                    args.name &&
                    [
                      "entityType",
                      "entityTypeId",
                      "entityId",
                      "properties",
                    ].includes(args.name)
                  ) {
                    return false;
                  }
                  setBlockEntity(
                    args.updated_src as Entity<Record<string, unknown>>,
                  );
                }}
                validationMessage="Not allowed"
              />
              <Collapse in={!!errors?.length}>
                {errors?.map((error) => (
                  <Typography
                    variant="subtitle2"
                    color={customColors.red[600]}
                    key={error}
                  >
                    {error}
                  </Typography>
                ))}
              </Collapse>
            </Box>
          </Box>

          {/* Readonly row */}
          <Box>
            <Typography variant="subtitle2">Read-only mode</Typography>
            <Switch
              checked={readonly}
              onChange={(evt) => setReadonly(evt.target.checked)}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Typography variant="subtitle2" mb={1}>
              Block Schema
            </Typography>
            <BlockSchemaView />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
