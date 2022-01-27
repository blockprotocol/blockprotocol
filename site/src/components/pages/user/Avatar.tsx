import { Box, Typography, BoxProps } from "@mui/material";
import React, { VFC } from "react";

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

export const Avatar: VFC<AvatarProps> = ({
  size = 250,
  name = "A",
  ...boxProps
}) => {
  return (
    <Box
      sx={{
        height: size,
        width: size,
        background: `linear-gradient(359.31deg, #7158FF 0.28%, #7F68FF 99.11%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        ...boxProps.sx,
      }}
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
