import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useLayoutEffect, useState } from "react";

import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/auth-wall";
import { DashboardCard } from "../../components/pages/dashboard/dashboard-card/dashboard-card";
import { DashboardSectionGrid } from "../../components/pages/dashboard/dashboard-section-grid";
import { DashboardSectionTitle } from "../../components/pages/dashboard/dashboard-section-title";
import { DashboardWordpressSection } from "../../components/pages/dashboard/dashboard-wordpress-section";
import { PageContainer } from "../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../components/pages/dashboard/top-navigation-tabs";
import {
  DashboardSection,
  getDashboardSectionCards,
} from "../../components/pages/dashboard/utils";
import { sanitizeUrl } from "../../lib/sanitize-url";

const Dashboard: AuthWallPageContent = ({ user }) => {
  const router = useRouter();
  const { preferredName: userName, shortname } = user ?? {};
  const [wordpressInstanceUrl, setWordpressInstanceUrl] = useState<
    string | null
  >(null);

  useLayoutEffect(() => {
    const queryWordpressInstanceUrl =
      router.query["link-wordpress"]?.toString();

    if (queryWordpressInstanceUrl) {
      setWordpressInstanceUrl(sanitizeUrl(queryWordpressInstanceUrl));
      void router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [router]);

  const dashboardCards = getDashboardSectionCards({
    profileLink: `/@${shortname}`,
  });

  const renderDashboardCards = (section: DashboardSection) =>
    dashboardCards[section].map((card) => (
      <DashboardCard key={card.title} {...card} />
    ));

  return (
    <>
      <NextSeo title="Block Protocol - Dashboard" />

      <TopNavigationTabs />

      <Box
        sx={{
          background: "linear-gradient(180deg, #F8F8F8 0%, #FFFFFF 100%)",
        }}
      >
        <Container
          sx={{
            paddingTop: {
              xs: 4,
              md: 8,
            },
            paddingBottom: {
              xs: 5,
              md: 9,
            },
          }}
        >
          <Typography
            variant="bpHeading2"
            color={(theme) => theme.palette.black}
          >
            Welcome, {userName}!
          </Typography>
          {wordpressInstanceUrl !== null ? (
            <DashboardWordpressSection
              wordpressInstanceUrl={wordpressInstanceUrl}
            />
          ) : null}
        </Container>
      </Box>

      <PageContainer sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <DashboardSectionTitle mb={-1} mt={0} pt={0}>
          Create
        </DashboardSectionTitle>

        <DashboardSectionGrid
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          }}
          columnGap={2}
        >
          {renderDashboardCards("create")}
        </DashboardSectionGrid>

        <DashboardSectionTitle>Manage</DashboardSectionTitle>

        <DashboardSectionGrid>
          {renderDashboardCards("manage")}
        </DashboardSectionGrid>

        <DashboardSectionTitle>Explore</DashboardSectionTitle>

        <DashboardSectionGrid>
          {renderDashboardCards("explore")}
        </DashboardSectionGrid>
      </PageContainer>
    </>
  );
};

export default withAuthWall(Dashboard);
