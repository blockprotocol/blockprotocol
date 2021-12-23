import { FunctionComponent } from "react";
import { Box, BoxProps } from "@mui/material";

type TabPanelProps = {
  index: number;
  value: number;
} & BoxProps;

export const TabPanel: FunctionComponent<TabPanelProps> = ({
  value,
  index,
  children,
  ...boxProps
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{ height: "100%", ...boxProps.sx }}
      {...boxProps}
    >
      {value === index ? children : null}
    </Box>
  );
};
