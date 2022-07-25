import { Box, Container, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, MouseEvent } from "react";

import { dashboardPages } from "./utils";

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

export const TopNavigationTabs: FunctionComponent = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: ({ palette }) => palette.gray[20],
        borderBottomStyle: "solid",
        marginTop: {
          xs: 2,
          md: 0,
        },
      }}
    >
      <Container>
        <Tabs
          value={
            dashboardPages.find((dashboardPage) =>
              router.asPath.includes(dashboardPage.tabHref),
            )?.tabHref
          }
          onChange={(_, newHref) => router.push(newHref)}
          aria-label="settings-tabs"
        >
          {dashboardPages.map(({ tabTitle, tabHref }, i) => (
            <Tab
              key={tabHref}
              label={tabTitle}
              value={tabHref}
              href={tabHref}
              component="a"
              onClick={(event: MouseEvent) => {
                event.preventDefault();
              }}
              {...a11yProps(i)}
            />
          ))}
        </Tabs>
      </Container>
    </Box>
  );
};
