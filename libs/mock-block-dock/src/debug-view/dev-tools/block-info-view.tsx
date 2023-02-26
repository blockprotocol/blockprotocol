import { Chip, Grid, Typography } from "@mui/material";

import {
  useMockBlockDockNonTemporalContext,
  useMockBlockDockTemporalContext,
} from "../../mock-block-dock-context";

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

const BlockInfoViewComponent = ({
  blockType,
  blockInfo,
}: {
  blockType: keyof typeof chipInfo | undefined;
  blockInfo: ReturnType<
    | typeof useMockBlockDockTemporalContext
    | typeof useMockBlockDockNonTemporalContext
  >["blockInfo"];
}) => (
  <Grid container spacing={2}>
    <Grid item xs={3} textAlign="right">
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Block Type
      </Typography>
    </Grid>
    <Grid item xs={9} fontSize={14}>
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
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Name
      </Typography>
    </Grid>
    <Grid item xs={9} fontSize={14}>
      {blockInfo.name}
    </Grid>
    <Grid item xs={3} textAlign="right">
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Display Name
      </Typography>
    </Grid>
    <Grid item xs={9} fontSize={14}>
      {blockInfo.displayName}
    </Grid>
    {/*  */}
    <Grid item xs={3} textAlign="right">
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Block Protocol Version
      </Typography>
    </Grid>
    <Grid item xs={9} fontSize={14}>
      {blockInfo.protocol}
    </Grid>
    {/*  */}
    <Grid item xs={3} textAlign="right">
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Icon path
      </Typography>
    </Grid>
    <Grid item xs={9} fontSize={14}>
      {blockInfo.icon}
    </Grid>
    {/*  */}
    <Grid item xs={3} textAlign="right">
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Preview Image path
      </Typography>
    </Grid>
    <Grid item xs={9} fontSize={14}>
      {blockInfo.image}
    </Grid>
  </Grid>
);

const BlockInfoViewTemporal = () => {
  const { blockInfo } = useMockBlockDockTemporalContext();

  const blockType = blockInfo.blockType.entryPoint as
    | keyof typeof chipInfo
    | undefined;

  return <BlockInfoViewComponent blockInfo={blockInfo} blockType={blockType} />;
};

const BlockInfoViewNonTemporal = () => {
  const { blockInfo } = useMockBlockDockNonTemporalContext();

  const blockType = blockInfo.blockType.entryPoint as
    | keyof typeof chipInfo
    | undefined;

  return <BlockInfoViewComponent blockInfo={blockInfo} blockType={blockType} />;
};

export const BlockInfoView = ({ temporal }: { temporal: boolean }) => {
  return temporal ? <BlockInfoViewTemporal /> : <BlockInfoViewNonTemporal />;
};
