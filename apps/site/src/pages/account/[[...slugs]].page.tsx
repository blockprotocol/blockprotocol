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
import { isBillingFeatureFlagEnabled } from "../../lib/config";
import { ApiKeysPanel } from "./api-keys-panel";
import { BillingPanel } from "./billing-panel/billing-panel";

const accountPanels = [
  ...(isBillingFeatureFlagEnabled
    ? [
        {
          title: "Billing",
          slug: "billing",
          panel: <BillingPanel />,
        },
      ]
    : []),
  {
    title: "API Keys",
    slug: "api",
    panel: <ApiKeysPanel />,
  },
] as const;

const sidebarMaxWidth = 150;

const Account: AuthWallPageContent = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    /**
     * @todo: remove this redirect when there is a panel with route "/account"
     */
    if (router.asPath === "/account") {
      void router.push("/account/billing");
    }
  }, [router]);

  const currentSettingsPanel = useMemo(() => {
    if (router.isReady) {
      const { query } = router;

      if (!query.slugs || typeof query.slugs === "string") {
        return undefined;
      }

      const currentSettingsPageSlug = query.slugs.join("/");

      return accountPanels.find(({ slug }) =>
        currentSettingsPageSlug.startsWith(slug),
      );
    }
  }, [router]);

  return (
    <>
      <NextSeo title="Block Protocol - Settings" />

      <TopNavigationTabs />

      <PageContainer>
        <Typography variant="bpHeading2" sx={{ fontSize: 44, marginBottom: 4 }}>
          My Account
        </Typography>
        <Box display="flex">
          <Sidebar
            sx={{
              height: "unset",
              minWidth: 125,
              maxWidth: sidebarMaxWidth,
              background: "transparent",
              borderRightWidth: 0,
              m: 1.5,
              marginLeft: 0,
            }}
            pages={accountPanels.map(({ title, slug }) => ({
              title,
              href: `/account/${slug}`,
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

export default withAuthWall(Account);
