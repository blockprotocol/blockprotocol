import { Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { CreateSchemaModal } from "../../components/modal/create-schema-modal";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/auth-wall";
import { DashboardCard } from "../../components/pages/dashboard/dashboard-card/dashboard-card";
import { SectionGrid } from "../../components/pages/dashboard/dashboard-section-grid";
import { SectionTitle } from "../../components/pages/dashboard/dashboard-section-title";
import { PageContainer } from "../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../components/pages/dashboard/top-navigation-tabs";
import {
  DashboardSection,
  getDashboardSectionCards,
} from "../../components/pages/dashboard/utils";

const Dashboard: AuthWallPageContent = ({ user }) => {
  const { preferredName: userName, shortname } = user ?? {};
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query?.slugs?.includes("create-schema")) {
      setSchemaModalOpen(true);
    }
  }, [router.query]);

  const openSchemaModal = useCallback(() => {
    setSchemaModalOpen(true);
  }, [setSchemaModalOpen]);

  const dashboardCards = getDashboardSectionCards({
    profileLink: `/@${shortname}`,
    openCreateSchemaModal: openSchemaModal,
  });

  const renderDashboardCards = (section: DashboardSection) =>
    dashboardCards[section].map((card) => (
      <DashboardCard key={card.title} {...card} />
    ));

  return (
    <>
      <Head>
        <title>Block Protocol - Dashboard</title>
      </Head>

      <TopNavigationTabs />

      <PageContainer sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="bpHeading2" mb={-2}>
          Welcome Back, {userName}!
        </Typography>

        <SectionTitle mb={-1}>Create</SectionTitle>

        <SectionGrid
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          }}
          columnGap={2}
        >
          {renderDashboardCards("create")}
        </SectionGrid>

        <SectionTitle>Manage</SectionTitle>

        <SectionGrid>{renderDashboardCards("manage")}</SectionGrid>

        <SectionTitle>Explore</SectionTitle>

        <SectionGrid>{renderDashboardCards("explore")}</SectionGrid>
      </PageContainer>

      <CreateSchemaModal
        open={schemaModalOpen}
        onClose={() => setSchemaModalOpen(false)}
      />
    </>
  );
};

export default withAuthWall(Dashboard);
