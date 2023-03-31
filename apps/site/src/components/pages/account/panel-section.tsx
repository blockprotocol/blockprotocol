import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export const PanelSection = ({
  children,
  title,
  description,
  titleEndContent,
}: {
  title: string;
  children: ReactNode;
  description?: ReactNode;
  titleEndContent?: ReactNode;
}) => {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="bpHeading2" sx={{ fontSize: 28, mb: 1 }}>
            {title}
          </Typography>
          <Typography
            sx={{
              color: "gray.70",
              maxWidth: "unset",
              fontSize: 15,
            }}
          >
            {description}
          </Typography>
        </Box>
        {!!titleEndContent && <Box>{titleEndContent}</Box>}
      </Box>
      {children}
    </div>
  );
};
