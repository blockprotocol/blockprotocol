import { Box, Stack, Typography } from "@mui/material";

import { InfoCircleIcon } from "../../../components/icons/info-circle-icon";

export const KeyNameInfoText = () => {
  return (
    <Stack
      direction="row"
      sx={{ gap: 1, mt: 2, alignItems: "flex-start", color: "#3A2084" }}
    >
      <InfoCircleIcon sx={{ fontSize: 13, mt: 0.2 }} />
      <Typography
        sx={{
          maxWidth: "unset",
          color: "inherit",
          fontSize: 14,
          lineHeight: 1.3,
        }}
      >
        Key names usually refer to the website or environment where they’ll be
        used.{" "}
        <Box component="span" color="purple.70">
          e.g. “WordPress” or “Staging”
        </Box>
      </Typography>
    </Stack>
  );
};
