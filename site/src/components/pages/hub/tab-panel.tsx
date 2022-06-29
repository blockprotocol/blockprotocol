import { Box, BoxProps } from "@mui/material";
import { FunctionComponent } from "react";

type TabPanelProps = {
  index: number;
  value: number;
} & BoxProps;

export const TabPanel: FunctionComponent<TabPanelProps> = ({
  value,
  index,
  children,
  sx = [],
  ...boxProps
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={[{ height: "100%" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...boxProps}
    >
      {value === index ? children : null}
    </Box>
  );
};
