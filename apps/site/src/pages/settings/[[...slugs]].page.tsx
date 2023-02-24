import { Box, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useLayoutEffect, useMemo } from "react";

import { Sidebar } from "../../components/page-sidebar";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/auth-wall";
import { PageContainer } from "../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../components/pages/dashboard/top-navigation-tabs";
import { ApiKeysSettingsPanel } from "./api-keys-settings-panel";
import { BillingSettingsPanel } from "./billing-settings-panel/billing-settings-panel";

const settingsPanels = [
  {
    title: "Billing",
    slug: "billing",
    panel: <BillingSettingsPanel />,
  },
  {
    title: "Api Keys",
    /**
     * @todo: rename this to `api-keys` when the billing page can be deleted.
     */
    slug: "api-keys-panel",
    panel: <ApiKeysSettingsPanel />,
  },
] as const;

const sidebarMaxWidth = 150;

const Settings: AuthWallPageContent = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    /**
     * @todo: remove this redirect when there is a panel with route "/settings"
     */
    if (router.asPath === "/settings") {
      void router.push("/settings/billing");
    }
  }, [router]);

  const currentSettingsPanel = useMemo(() => {
    if (router.isReady) {
      const { query } = router;

      if (!query.slugs || typeof query.slugs === "string") {
        return undefined;
      }

      const currentSettingsPageSlug = query.slugs.join("/");

      return settingsPanels.find(({ slug }) =>
        currentSettingsPageSlug.startsWith(slug),
      );
    }
  }, [router]);

  return (
    <>
      <NextSeo title="Block Protocol - Settings" />

      <TopNavigationTabs />

      <PageContainer>
        <Typography
          variant="h1"
          sx={{ fontSize: 44, fontWeight: 400, marginBottom: 4 }}
        >
          Account Settings
        </Typography>
        <Box display="flex">
          <Sidebar
            sx={{
              height: "unset",
              minWidth: 125,
              maxWidth: sidebarMaxWidth,
              background: "transparent",
              borderRightWidth: 0,
            }}
            pages={settingsPanels.map(({ title, slug }) => ({
              title,
              href: `/settings/${slug}`,
            }))}
          />
          <Paper sx={{ flexGrow: 1, padding: 6, marginBottom: 6 }}>
            {currentSettingsPanel?.panel}
          </Paper>
        </Box>
      </PageContainer>
    </>
  );
};

export default withAuthWall(Settings);
