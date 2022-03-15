import { Box } from "@mui/material";
import { ReactNode, VoidFunctionComponent } from "react";

export interface PlaceholderProps {
  header: ReactNode;
  tip: ReactNode;
  actions: ReactNode;
}

export const Placeholder: VoidFunctionComponent<PlaceholderProps> = ({
  header,
  tip,
  actions,
}) => {
  return (
    <Box
      sx={{
        border: ({ palette }) => "1px dashed ${palette.gray[40]}",
        borderRadius: "8px",
        textAlign: "center",
        paddingY: { xs: 6, sm: 12 },
        paddingX: 4,
      }}
    >
      <Box
        sx={{
          fontSize: 24,
          color: ({ palette }) => palette.gray[80],
        }}
      >
        {header}
      </Box>
      <Box
        sx={{
          fontSize: 16,
          color: ({ palette }) => palette.gray[70],
          paddingTop: 1,
          paddingBottom: 2,
        }}
      >
        {tip}
      </Box>
      <Box>{actions}</Box>
    </Box>
  );
};
