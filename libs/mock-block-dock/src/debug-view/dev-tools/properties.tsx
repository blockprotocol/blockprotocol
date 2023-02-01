import { Entity } from "@blockprotocol/graph";
import { getEntityTypeById, getRoots } from "@blockprotocol/graph/stdlib";
import {
  Box,
  Collapse,
  Container,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { customColors } from "../theme/palette";
import { BlockSchemaView } from "./block-schema-view";
import { EntitySwitcher } from "./entity-switcher";
import { JsonView } from "./json-view";

// const ajv = new Ajv();

export const PropertiesView = () => {
  const { readonly, setReadonly, blockEntitySubgraph, updateEntity, graph } =
    useMockBlockDockContext();

  const blockEntity = useMemo(
    () => getRoots(blockEntitySubgraph)[0]!,
    [blockEntitySubgraph],
  );

  const blockEntityType = useMemo(
    () => getEntityTypeById(graph, blockEntity.metadata.entityTypeId),
    [graph, blockEntity],
  );

  /** @todo - reimplement validation */

  // const validate = ajv.compile(blockSchema ?? {});
  // validate(blockEntity.properties);
  // const errors = validate.errors?.map((error) => error.message);

  const errors: never[] = [];

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
                    (args.name.includes("versionId") ||
                      args.name.includes("baseId") ||
                      args.name.includes("leftEntityId") ||
                      args.name.includes("rightEntityId"))
                  ) {
                    return false;
                  }
                  const entity = args.updated_src as Entity;
                  void updateEntity({
                    data: {
                      entityId: entity.metadata.recordId.entityId,
                      entityTypeId: entity.metadata.entityTypeId,
                      properties: entity.properties,
                      leftToRightOrder: entity.linkData?.leftToRightOrder,
                      rightToLeftOrder: entity.linkData?.rightToLeftOrder,
                    },
                  });
                }}
                onAdd={(args) => {
                  // don't allow adding of top level fields
                  if (!args.namespace.includes("properties")) {
                    return false;
                  }
                  const entity = args.updated_src as Entity;
                  void updateEntity({
                    data: {
                      entityId: entity.metadata.recordId.entityId,
                      entityTypeId: entity.metadata.entityTypeId,
                      properties: entity.properties,
                      leftToRightOrder: entity.linkData?.leftToRightOrder,
                      rightToLeftOrder: entity.linkData?.rightToLeftOrder,
                    },
                  });
                }}
                onDelete={(args) => {
                  // don't allow deleting of top level fields
                  if (!args.namespace.includes("properties")) {
                    return false;
                  }
                  const entity = args.updated_src as Entity;
                  void updateEntity({
                    data: {
                      entityId: entity.metadata.recordId.entityId,
                      entityTypeId: entity.metadata.entityTypeId,
                      properties: entity.properties,
                      leftToRightOrder: entity.linkData?.leftToRightOrder,
                      rightToLeftOrder: entity.linkData?.rightToLeftOrder,
                    },
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
          {blockEntityType && (
            <Box>
              <Typography variant="subtitle2" mb={1}>
                Block Schema
              </Typography>
              <BlockSchemaView entityType={blockEntityType.schema} />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
