import { Typography } from "@mui/material";

import { SparklesSolidIcon } from "../../../../../components/icons/sparkles-solid-icon";

export const NewIndicator = () => {
  return (
    <Typography
      variant="bpSmallCaps"
      sx={{
        color: "purple.70",
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      new
      <SparklesSolidIcon sx={{ color: "purple", fontSize: 15, ml: 0.5 }} />
    </Typography>
  );
};
