import { BlockGraphProperties } from "@blockprotocol/graph";
import { Box, Grid, Switch } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { JsonView } from "../json-view";

type Props = {
  blockEntity?: BlockGraphProperties<any>["graph"]["blockEntity"];
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
};

export const PropertiesView = ({
  readonly,
  blockEntity,
  setReadonly,
}: Props) => {
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
          />
        </Box>
      </Grid>
    </Grid>
  );
};
