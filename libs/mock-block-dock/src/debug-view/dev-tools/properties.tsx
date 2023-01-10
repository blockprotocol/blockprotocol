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
  const { readonly, setReadonly, blockSchema, blockEntity, updateEntity } =
    useMockBlockDockContext();

  const validate = ajv.compile(blockSchema ?? {});
  validate(blockEntity.properties);
  const errors = validate.errors?.map((error) => error.message);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={6}>
          {/* Entity Properties row */}
          <Box mb={3}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle2">Entity Properties</Typography>
              <EntitySwitcher />
              {/* Readonly toggle */}
              <Box sx={{ display: "flex" }}>
                <Typography variant="subtitle2" mr={1}>
                  Read-only mode
                </Typography>
                <Switch
                  checked={readonly}
                  onChange={(evt) => setReadonly(evt.target.checked)}
                  size="small"
                />
              </Box>
            </Box>

            <Box maxWidth={800}>
              <JsonView
                collapseKeys={["graph"]}
                rootName="blockEntity"
                sortKeys
                src={blockEntity ?? {}}
                onEdit={(args) => {
                  // These fields should not be edited
                  if (
                    args.name &&
                    ["entityType", "entityTypeId", "entityId"].includes(
                      args.name,
                    )
                  ) {
                    return false;
                  }
                  void updateEntity({
                    data: args.updated_src as Entity,
                  });
                }}
                onAdd={(args) => {
                  // don't allow adding of top level fields
                  if (args.name && !args.name.includes("properties")) {
                    return false;
                  }
                  void updateEntity({
                    data: args.updated_src as Entity,
                  });
                }}
                onDelete={(args) => {
                  // These fields should not be deleted
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
                  void updateEntity({
                    data: args.updated_src as Entity,
                  });
                }}
                validationMessage="You may only edit the properties object"
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
        </Grid>
        <Grid item xs={6}>
          {blockSchema && (
            <Box>
              <Typography variant="subtitle2" mb={1}>
                Block Schema
              </Typography>
              <BlockSchemaView />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
