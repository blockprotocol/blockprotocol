import {
  useTheme,
  useMediaQuery,
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  DashboardCard,
  DashboardCardProps,
} from "../components/pages/dashboard/DashboardCard";
import { dashboardPages } from "../components/pages/dashboard/utils";

const href = "/dashboard";

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

type DashboardPageProps = {
  userName: string;
};

const defaultProps: DashboardPageProps = {
  userName: "Martha",
};

const dashboardCardData: DashboardCardProps[] = [
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
    title: "Generate your API key",
    colorGradient:
      "linear-gradient(91.21deg, #FFB172 -84.62%, #9482FF 62.56%, #84E6FF 154.58%)",
    description:
      "Your API key will allow you to browse the docs, submit blocks, and other exciting things in here.",
    link: {
      title: "Generate Key",
      href: "/settings/api-keys",
    },
  },
];

const DashboardPage: NextPage<DashboardPageProps> = () => {
  const router = useRouter();
  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));

  const { userName } = defaultProps;

  return (
    <>
      <Head>
        <title>Block Protocol - Dashboard</title>
      </Head>
      {md && (
        <Box
          sx={{
            borderBottom: 1,
            borderColor: ({ palette }) => palette.gray[20],
            borderBottomStyle: "solid",
          }}
        >
          <Container>
            <Tabs
              value={href}
              onChange={(_, newHref) => router.push(newHref)}
              aria-label="documentation-tabs"
            >
              {dashboardPages.map(({ tabTitle, tabHref }, i) => (
                <Tab
                  key={tabHref}
                  label={tabTitle}
                  value={tabHref}
                  href={tabHref}
                  component="a"
                  onClick={(
                    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
                  ) => {
                    event.preventDefault();
                  }}
                  {...a11yProps(i)}
                />
              ))}
            </Tabs>
          </Container>
        </Box>
      )}
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
            variant="bpTitle"
            sx={{
              marginBottom: 2,
            }}
          >
            Welcome Back, {userName}!
          </Typography>

          <Typography
            maxWidth={750}
            sx={{
              marginTop: {
                xs: 3,
                md: 6,
              },
              textTransform: "uppercase",
              color: "#64778C",
              fontWeight: 600,
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
            paddingTop={2}
            paddingBottom={4}
          >
            {dashboardCardData.map((dashboardCard, dashboardCardIndex) => (
              <DashboardCard
                // eslint-disable-next-line react/no-array-index-key
                key={`dashboardCard-${dashboardCardIndex}`}
                {...dashboardCard}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage;
