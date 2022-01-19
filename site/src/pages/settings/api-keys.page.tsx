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
import { useState } from "react";

import { Link } from "../../components/Link";
import { GenerateApiModal } from "../../components/pages/dashboard/GenerateApiModal";
import { RegenerateApiModal } from "../../components/pages/dashboard/RegenerateApiModal";

import {
  dashboardPages,
  dashboardSmallButtonStyles,
} from "../../components/pages/dashboard/utils";
import { Sidebar } from "../../components/PageSidebar";
import { WarningIcon } from "../../components/SvgIcon/WarningIcon";
import { BpTable, TableRows } from "../../components/Table";
import { SiteMapPage } from "../../lib/sitemap";

const href = "/settings/api-keys";

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

type ApiPageProps = {};

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

const DashboardPage: NextPage<ApiPageProps> = () => {
  const router = useRouter();
  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));

  const [tableRows, setTableRows] = useState<TableRows>([]);
  const [generateKeyModalOpen, setGenerateKeyModalOpen] = useState(false);
  const [regenerateKeyModalOpen, setRegenerateKeyModalOpen] = useState(false);

  const closeGenerateModal = () => {
    setGenerateKeyModalOpen(false);
  };

  const closeRegenerateModal = () => {
    setRegenerateKeyModalOpen(false);
  };

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

          <Box
            py={4}
            display={{ xs: "block", md: "flex" }}
            alignItems="flex-start"
          >
            {md ? (
              <Sidebar flexGrow={0} pages={tabPages} />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  marginBottom: 1,
                  background: "white",
                  border: "1px solid #C5D1DB",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                  borderRadius: 2,
                  p: 1,
                }}
                component="select"
                value="api-keys"
              >
                <option>General</option>
                <option value="api-keys">API Keys</option>
                <option>Security</option>
              </Box>
            )}
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
              {!!tableRows.length && (
                <BpTable
                  header={["Name", "Public ID", "Last Used", "Created"]}
                  rows={tableRows}
                />
              )}

              <Box sx={{ paddingTop: 2 }}>
                <Box
                  component="button"
                  sx={dashboardSmallButtonStyles}
                  onClick={() => {
                    return tableRows.length
                      ? setRegenerateKeyModalOpen(true)
                      : setGenerateKeyModalOpen(true);
                  }}
                >
                  {tableRows.length ? (
                    <>
                      <WarningIcon
                        width="auto"
                        height="1em"
                        sx={{ fontSize: "1em", marginRight: 1 }}
                      />{" "}
                      Regenerate
                    </>
                  ) : (
                    "+ Generate"
                  )}{" "}
                  API Key
                </Box>

                <GenerateApiModal
                  closeGenerateModal={closeGenerateModal}
                  generateKeyModalOpen={generateKeyModalOpen}
                  setTableRows={setTableRows}
                />

                <RegenerateApiModal
                  closeRegenerateModal={closeRegenerateModal}
                  keyName={tableRows?.[0]?.[0]?.toString() ?? ""}
                  regenerateKeyModalOpen={regenerateKeyModalOpen}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage;
