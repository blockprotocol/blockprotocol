import { VFC, FC } from "react";
import { Box, Tabs, Typography, BoxProps, Tab } from "@mui/material";

export const TABS = [
  {
    title: "Overview",
    value: "overview",
    slug: "",
  },
  {
    title: "Blocks",
    value: "blocks",
    slug: "blocks",
  },
  {
    title: "Schemas",
    value: "schemas",
    slug: "schemas",
  },
] as {
  title: string;
  value: "overview" | "blocks" | "schemas";
  slug: "" | "blocks" | "schemas";
}[];

export type TabValue = typeof TABS[number]["value"];

type TabHeaderProps = {
  activeTab: string;
  setActiveTab: (tab: TabValue) => void;
  tabs: { title: string; value: TabValue }[];
  tabItemsCount: { blocks: number; schemas: number };
};

export const TabHeader: VFC<TabHeaderProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  tabItemsCount,
}) => {
  return (
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => setActiveTab(newValue)}
      aria-label="user-profile-tabs"
      sx={{
        mt: { xs: -6, md: -6 },
        mb: 4,
      }}
    >
      {tabs.map(({ title, value }, i) => (
        <Tab
          key={value}
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {title}
              {value !== "overview" && (
                <Box
                  sx={{
                    ml: 1,
                    minWidth: 25,
                    minHeight: 25,
                    borderRadius: "30px",
                    px: 1,
                    py: 0.25,
                    backgroundColor: ({ palette }) =>
                      value === activeTab
                        ? palette.purple[100]
                        : palette.gray[20],
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="bpMicroCopy"
                    sx={{
                      color: ({ palette }) =>
                        value === activeTab
                          ? palette.purple[600]
                          : palette.gray[70],
                    }}
                  >
                    {value === "blocks"
                      ? tabItemsCount.blocks
                      : tabItemsCount.schemas}
                  </Typography>
                </Box>
              )}
            </Box>
          }
          value={value}
          id={`profile-tab-${i}`}
          aria-controls={`profile-tabpanel-${i}`}
        />
      ))}
    </Tabs>
  );
};

type TabPanelProps = {
  index: number;
  value: string;
  activeTab: string;
} & BoxProps;

export const TabPanel: FC<TabPanelProps> = ({
  value,
  activeTab,
  index,
  children,
  ...boxProps
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== activeTab}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      sx={{ height: "100%", ...boxProps.sx }}
      {...boxProps}
    >
      {value === activeTab ? children : null}
    </Box>
  );
};
