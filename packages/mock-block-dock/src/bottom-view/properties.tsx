import { Box, Grid, Switch } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { JsonView } from "../json-view";

// @todo fix types... Types should be similar to mock-block-dock
type Props = {
  properties: {
    readonly: boolean;
    blockEntity: any;
  };
  setReadonly: Dispatch<SetStateAction<boolean>>;
};

export const PropertiesView = ({ properties, setReadonly }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3} textAlign="right" alignSelf="center">
        Read-only mode
      </Grid>
      <Grid item xs={9}>
        <Switch
          checked={properties.readonly}
          onChange={evt => setReadonly(evt.target.checked)}
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
            src={properties.blockEntity}
            //   onEdit={() => {
            //     return true;
            //   }}
            //   onAdd={() => {}}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
