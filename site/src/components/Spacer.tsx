import { FC } from "react";
import { Box } from "@mui/material";

type SpacerProps = {
  height?: number;
  width?: number;
};

export const Spacer: FC<SpacerProps> = ({ height, width }) => {
  return (
    <Box
      sx={{
        height: (theme) => theme.spacing(height ?? 0),
        width: (theme) => theme.spacing(width ?? 0),
      }}
    />
  );
};
