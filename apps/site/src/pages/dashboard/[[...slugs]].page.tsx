import { Typography } from "@mui/material";
import { NextSeo } from "next-seo";

import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/auth-wall";
import { DashboardCard } from "../../components/pages/dashboard/dashboard-card/dashboard-card";
import { DashboardSectionGrid } from "../../components/pages/dashboard/dashboard-section-grid";
import { DashboardSectionTitle } from "../../components/pages/dashboard/dashboard-section-title";
import { PageContainer } from "../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../components/pages/dashboard/top-navigation-tabs";
import {
  DashboardSection,
  getDashboardSectionCards,
} from "../../components/pages/dashboard/utils";

const Dashboard: AuthWallPageContent = ({ user }) => {
  const { preferredName: userName, shortname } = user ?? {};

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

      <PageContainer sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="bpHeading2" mb={-2}>
          Welcome Back, {userName}!
        </Typography>

        <DashboardSectionTitle mb={-1}>Create</DashboardSectionTitle>

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
