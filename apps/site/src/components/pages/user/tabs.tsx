import { Box, BoxProps, Tab, Tabs, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { BaseLink } from "../../base-link";

export const TABS = [
  {
    title: "Overview",
    value: "overview",
    slug: "",
    testId: "profile-page-overview-tab",
  },
  {
    title: "Blocks",
    value: "blocks",
    slug: "blocks",
    testId: "profile-page-blocks-tab",
  },
  {
    title: "Types",
    value: "all-types",
    slug: "all-types",
    testId: "profile-page-schemas-tab",
  },
] as const;

export type TabValue = (typeof TABS)[number]["value"];

type TabHeaderProps = {
  activeTab: string;
  tabItemsCount: Partial<Record<TabValue, number>>;
  userShortname: string;
};

export const TabHeader: FunctionComponent<TabHeaderProps> = ({
  activeTab,
  tabItemsCount,
  userShortname,
}) => {
  return (
    <Tabs
      value={TABS.findIndex((tab) => tab.value === activeTab)}
      aria-label="user-profile-tabs"
      sx={{
        mt: { xs: -6, md: -6 },
        mb: 4,
      }}
    >
      {TABS.map(({ title, value, slug, testId }, index) => {
        const itemCount = tabItemsCount[value];
        const tabIsActive = value === activeTab;

        return (
          <BaseLink
            data-testid={testId}
            href={`/@${userShortname}${slug ? `/${slug}` : ""}`}
            shallow
            key={value}
          >
            <Tab
              sx={{ opacity: 1 }}
              label={
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {title}
                  {typeof itemCount === "number" && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        minWidth: 25,
                        minHeight: 25,
                        borderRadius: "30px",
                        px: 1,
                        py: 0.25,
                        backgroundColor: ({ palette }) =>
                          tabIsActive ? palette.purple[100] : palette.gray[20],
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="bpMicroCopy"
                        sx={{
                          color: ({ palette }) =>
                            tabIsActive
                              ? palette.purple[600]
                              : palette.gray[70],
                        }}
                      >
                        {itemCount}
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
              value={value}
              id={`profile-tab-${index}`}
              aria-controls={`profile-tabpanel-${index}`}
            />
          </BaseLink>
        );
      })}
    </Tabs>
  );
};

type TabPanelProps = {
  index: number;
  value: string;
  activeTab: string;
} & BoxProps;

export const TabPanel: FunctionComponent<TabPanelProps> = ({
  value,
  activeTab,
  index,
  children,
  sx = [],
  ...boxProps
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== activeTab}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      sx={[{ height: "100%" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...boxProps}
    >
      {value === activeTab ? children : null}
    </Box>
  );
};
