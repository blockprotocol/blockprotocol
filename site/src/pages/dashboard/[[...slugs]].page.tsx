import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  DashboardCard,
  DashboardCardProps,
} from "../../components/pages/dashboard/DashboardCard";
import { TopNavigationTabs } from "../../components/pages/dashboard/TopNavigationTabs";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/authWall";
import { CreateSchemaModal } from "../../components/Modal/CreateSchemaModal";

const getDashboardPrimaryCardData = (
  openCreateSchemaModal: () => void,
): DashboardCardProps[] => [
  {
    title: "Read our quick start guide to building blocks",
    colorGradient:
      "linear-gradient(291.34deg, #FFB172 -4.12%, #D082DE 53.49%, #9482FF 91.74%, #84E6FF 151.68%)",
    description:
      "Learn how to build blocks that can integrate with the block protocol and be published to the registry.",
    link: {
      title: "Read the guide",
      href: "/docs/developing-blocks",
    },
  },
  {
    title: "Test out blocks in the playground",
    colorGradient:
      "linear-gradient(310.17deg, #FFB172 -167.67%, #9482FF 13.54%, #84E6FF 126.83%)",
    description:
      "Try out our most popular blocks to learn how they consume and render different data structures",
    link: {
      title: "Try out blocks",
      href: "/hub",
    },
  },
  {
    title: "Create a Schema",
    colorGradient:
      "linear-gradient(91.21deg, #FFB172 -84.62%, #9482FF 62.56%, #84E6FF 154.58%)",
    description:
      "Schemas are a formal way to describe data – they define the expected properties of things like People, Companies, and Books",
    link: {
      title: "Create a schema",
      onClick: openCreateSchemaModal,
    },
  },
];

const getDashboardSecondaryCardData = (
  profileLink: string,
): DashboardCardProps[] => [
  {
    title: "Generate your API key",
    description:
      "Your API key will allow you to search for blocks by name, author, or compatible data structure.",
    link: {
      title: "Generate Key",
      href: "/settings/api-keys",
    },
    icon: "fa-solid fa-key",
  },
  {
    title: "View your public profile",
    description:
      "See what others see and browse your published blocks and schemas",
    link: {
      title: "View Profile",
      href: profileLink,
    },
    icon: "fa-solid fa-user",
    variant: "secondary",
  },
];

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

  return (
    <>
      <Head>
        <title>Block Protocol - Dashboard</title>
      </Head>

      <TopNavigationTabs />

      <Box
        sx={{
          background:
            "linear-gradient(180deg, #FAFBFC 0%, rgba(250, 251, 252, 0) 100%)",
        }}
      >
        <Container
          sx={{
            paddingTop: {
              xs: 5,
              md: 9,
            },
            paddingBottom: {
              xs: 5,
              md: 9,
            },
          }}
        >
          <Typography
            variant="bpHeading2"
            sx={{
              marginBottom: 2,
            }}
          >
            Welcome Back, {userName}!
          </Typography>

          <Typography
            variant="bpSmallCaps"
            maxWidth={750}
            sx={{
              mt: {
                xs: 3,
                md: 6,
              },
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: ({ palette }) => palette.gray[70],
              fontWeight: 600,
              mb: 2,
            }}
          >
            Start Exploring
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            }}
            columnGap={2}
            rowGap={3}
            mb={3}
          >
            {getDashboardPrimaryCardData(openSchemaModal).map(
              (dashboardCard) => (
                <DashboardCard
                  key={`dashboardCard-${dashboardCard.link.href}`}
                  {...dashboardCard}
                />
              ),
            )}
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              md: "1fr 1fr",
            }}
            alignItems="flex-start"
            columnGap={3}
            rowGap={3}
            paddingBottom={4}
          >
            {getDashboardSecondaryCardData(`/@${shortname}`).map(
              (dashboardCard) => (
                <DashboardCard
                  key={`dashboardCard-${dashboardCard.link.href}`}
                  {...dashboardCard}
                  variant="secondary"
                />
              ),
            )}
          </Box>
        </Container>
      </Box>
      <CreateSchemaModal
        open={schemaModalOpen}
        onClose={() => setSchemaModalOpen(false)}
      />
    </>
  );
};

export default withAuthWall(Dashboard);
