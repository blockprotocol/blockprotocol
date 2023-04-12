import {
  Box,
  MenuItem,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { ReactNode, useMemo } from "react";

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
import { GeneralPanel } from "./general-panel/general-panel";

type AccountPanel = {
  title: string;
  slug: string;
  panel: ReactNode;
};

const accountPanels: AccountPanel[] = [
  {
    title: "General",
    slug: "general",
    panel: <GeneralPanel />,
  },
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
];

const sidebarMaxWidth = 150;

const Account: AuthWallPageContent = () => {
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const currentPanel = useMemo(() => {
    if (router.isReady) {
      const { query } = router;

      if (!query.slugs || typeof query.slugs === "string") {
        return accountPanels[0];
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

        {isMobile && (
          <Select
            sx={{
              width: "100%",
              mb: 2,
              background: "white",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
              height: 40,
            }}
            value={currentPanel?.slug}
            onChange={(event) => {
              void router.push(`/account/${event.target.value}`);
            }}
          >
            {accountPanels.map(({ title, slug }) => (
              <MenuItem key={slug} value={slug}>
                {title}
              </MenuItem>
            ))}
          </Select>
        )}

        <Box display="flex">
          {!isMobile && (
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
          )}
          <Paper sx={{ flexGrow: 1, p: isMobile ? 3 : 6, mb: 6 }}>
            {currentPanel?.panel}
          </Paper>
        </Box>
      </PageContainer>
    </>
  );
};

export default withAuthWall(Account);
