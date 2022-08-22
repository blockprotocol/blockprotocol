import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bottom-view-tabpanel-${index}`}
      aria-labelledby={`bottom-view-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const a11yProps = (index: number) => {
  return {
    id: `bottom-view-tab-${index}`,
    "aria-controls": `bottom-view-tabpanel-${index}`,
  };
};
