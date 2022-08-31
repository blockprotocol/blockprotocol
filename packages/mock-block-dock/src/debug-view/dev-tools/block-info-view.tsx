import { Chip, Grid, Typography } from "@mui/material";

import { useMockBlockDockContext } from "../../mock-block-dock-context";

const chipInfo = {
  html: {
    color: "info",
    label: "HTML Block",
  },
  "custom-element": {
    label: "Custom Element Block",
    color: "warning",
  },
  react: { label: "React Block", color: "secondary" },
} as const;

export const BlockInfoView = () => {
  const { blockInfo } = useMockBlockDockContext();

  const blockType = blockInfo.blockType.entryPoint as
    | keyof typeof chipInfo
    | undefined;

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} textAlign="right">
        <Typography variant="subtitle2">Block Type</Typography>
      </Grid>
      <Grid item xs={9}>
        {blockType && (
          <Chip
            variant="outlined"
            size="small"
            label={chipInfo[blockType].label}
            color={chipInfo[blockType].color}
          />
        )}
      </Grid>
      {/*  */}
      <Grid item xs={3} textAlign="right">
        <Typography variant="subtitle2">Display Name</Typography>
      </Grid>
      <Grid item xs={9}>
        {blockInfo.displayName}
      </Grid>
      {/*  */}
      <Grid item xs={3} textAlign="right">
        <Typography variant="subtitle2">Block Protocol Version</Typography>
      </Grid>
      <Grid item xs={9}>
        {blockInfo.protocol}
      </Grid>
      {/*  */}
      <Grid item xs={3} textAlign="right">
        <Typography variant="subtitle2">Icon path</Typography>
      </Grid>
      <Grid item xs={9}>
        {blockInfo.icon}
      </Grid>
      {/*  */}
      <Grid item xs={3} textAlign="right">
        <Typography variant="subtitle2">Preview Image path</Typography>
      </Grid>
      <Grid item xs={9}>
        {blockInfo.image}
      </Grid>
    </Grid>
  );
};
