import { Box, BoxProps, Typography } from "@mui/material";
import { FunctionComponent } from "react";

const getInitial = (name: string) => {
  if (name.length > 0) {
    return name[0];
  }
  return "U";
};

type AvatarProps = {
  size: number;
  name?: string;
} & BoxProps;

export const Avatar: FunctionComponent<AvatarProps> = ({
  size = 250,
  name = "A",
  sx = [],
}) => {
  return (
    <Box
      sx={[
        {
          height: size,
          width: size,
          background: `linear-gradient(359.31deg, #7158FF 0.28%, #7F68FF 99.11%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        sx={{
          fontSize: 0.64 * size,
          lineHeight: 1.2,
          color: ({ palette }) => palette.common.white,
          fontWeight: 900,
        }}
      >
        {getInitial(name)}
      </Typography>
    </Box>
  );
};
