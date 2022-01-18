import {
  useTheme,
  useMediaQuery,
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  TableCell,
} from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, VoidFunctionComponent } from "react";
import { Button } from "../../components/Button";

import { Link } from "../../components/Link";

import { dashboardPages } from "../../components/pages/dashboard/utils";
import { Sidebar } from "../../components/PageSidebar";
import { BpTable } from "../../components/Table";
import { SiteMapPage } from "../../lib/sitemap";

const href = "/settings/api-keys";

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

type ApiPageProps = {};

const defaultProps: ApiPageProps = {};

const tabPages: SiteMapPage[] = [
  {
    title: "General",
    href: "/settings/general",
    sections: [],
    subPages: [],
  },
  {
    title: "API Keys",
    href: "/settings/api-keys",
    sections: [],
    subPages: [],
  },
  {
    title: "Security",
    href: "/settings/security",
    sections: [],
    subPages: [],
  },
];

const KeyRenderer: VoidFunctionComponent<{ apiKey: string }> = ({ apiKey }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <TableCell sx={{ position: "relative", width: 300 }}>
      <Box
        sx={{
          overflowWrap: "anywhere",
          filter: revealed ? undefined : "blur(12px)",
          transition: "filter 0.2s ease-in-out",
        }}
      >
        {apiKey}
      </Box>

      <Box
        sx={{
          position: revealed ? "block" : "absolute",
          width: "100%",
          height: revealed ? "auto" : "100%",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 2,
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Box
          p={1}
          component="button"
          sx={{
            background: "#FFFFFF",
            border: "1px solid #C1CFDE",
            boxShadow:
              "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
            borderRadius: 2,
          }}
          onClick={() => setRevealed(!revealed)}
        >
          {revealed ? "Hide" : "Reveal"} Key
        </Box>
      </Box>
    </TableCell>
  );
};

const DashboardPage: NextPage<ApiPageProps> = () => {
  const router = useRouter();
  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));

  const tableRows = [
    [
      "Key1",
      <KeyRenderer apiKey="bpkey_7f89shh5009jg8hfnefj0989dqnm0076s00cl8kj9jj87hfnefj0989dqnm0000007shj9" />,
      "2 hours ago",
      "8 months ago",
      "Dropdown",
    ],
    [
      "Key2",
      <KeyRenderer apiKey="bpkey_7f89shh5009jg8hfnefj0989dqnm0076s00cl8kj9jj87hfnefj0989dqnm0000007shj9" />,
      "2 hours ago",
      "8 months ago",
      "Dropdown",
    ],
  ];

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
            Account Settings
          </Typography>

          <Box py={4} display="flex" alignItems="flex-start">
            {md ? <Sidebar flexGrow={0} pages={tabPages} /> : null}
            <Box
              sx={{
                boxShadow:
                  "0px 4px 11px rgba(39, 50, 86, 0.04), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.08), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
                background: "white",
                width: "100%",
                borderRadius: 2,
              }}
              p={4}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "22.5px",
                  lineHeight: "110%",
                  color: "#37434F",
                  paddingBottom: 1,
                }}
              >
                API Keys
              </Typography>
              <Box>
                <p>
                  These keys allow you to access the block protocol from within
                  your application.
                </p>
                <p>
                  Keep them private to prevent other people from accessing your
                  account.{" "}
                  <Link
                    sx={{ color: "#6048E5", textDecoration: "underline" }}
                    href="#"
                  >
                    Learn More
                  </Link>
                </p>
              </Box>
              <BpTable
                header={["Name", "Token", "Last Used", "Created", ""]}
                rows={tableRows}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage;
