import { Box, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export interface PlaceholderProps {
  header: ReactNode;
  tip: ReactNode;
  actions: ReactNode;
}

export const Placeholder: FunctionComponent<PlaceholderProps> = ({
  header,
  tip,
  actions,
}) => {
  return (
    <Box
      sx={{
        border: ({ palette }) => `1px dashed ${palette.gray[40]}`,
        borderRadius: "8px",
        textAlign: "center",
        paddingY: { xs: 6, sm: 12 },
        paddingX: 4,
      }}
    >
      <Typography variant="bpHeading4">{header}</Typography>
      <Typography
        sx={{
          color: ({ palette }) => palette.gray[70],
          paddingTop: 1,
          paddingBottom: 2,
        }}
      >
        {tip}
      </Typography>
      <Box>{actions}</Box>
    </Box>
  );
};
