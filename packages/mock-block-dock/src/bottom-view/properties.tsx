import { BlockGraphProperties } from "@blockprotocol/graph";
import { Box, Collapse, Grid, Stack, Switch, Tooltip } from "@mui/material";
import Ajv from "ajv";

import { JsonView } from "../json-view";
import { useMockBlockDockContext } from "../mock-block-dock-context";
import { BlockSchemaView } from "./block-schema-view";

type Props = {
  blockEntity?: BlockGraphProperties<any>["graph"]["blockEntity"];
  // setBlockEntity: (entity: Entity) => void;
};

const ajv = new Ajv();

export const PropertiesView = ({ blockEntity }: Props) => {
  const { readonly, setReadonly, blockSchema } = useMockBlockDockContext();
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
                <Collapse in={!!validate.errors?.length}>
                  {/* @todo display errors in collapsible manner */}
                  {validate.errors?.map((error, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Box key={index}>{JSON.stringify(error.message)}</Box>
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
