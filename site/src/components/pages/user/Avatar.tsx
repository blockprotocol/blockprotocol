import { Box, Typography } from "@mui/material";
import React from "react";

const getInitial = (name: string) => {
  if (name.length > 0) {
    return name[0];
  }
  return "U";
};

export const Avatar = ({ size = 250, name = "A", sx }) => {
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
        ...sx,
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
