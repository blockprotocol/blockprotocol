import { Box, BoxProps } from "@mui/material";

export const DashboardSectionGrid = ({ children, ...props }: BoxProps) => (
  <Box
    display="grid"
    gridTemplateColumns={{
      xs: "1fr",
      md: "1fr 1fr",
    }}
    columnGap={3}
    rowGap={3}
    {...props}
  >
    {children}
  </Box>
);
