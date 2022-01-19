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
import { MouseEvent, useEffect, useMemo, useState } from "react";

import { Link } from "../../components/Link";
import { GenerateApiModal } from "../../components/pages/dashboard/GenerateApiModal";

import { dashboardPages } from "../../components/pages/dashboard/utils";
import { WarningIcon } from "../../components/SvgIcon/WarningIcon";
import { Table, TableRows } from "../../components/Table";
import { UserFacingApiKeyProperties } from "../../lib/model/apiKey.model";
import { apiClient } from "../../lib/apiClient";
import { DateTimeCell } from "../../components/TableCells";
import { Button } from "../../components/Button";

const href = "/settings/api-keys";

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

type ApiPageProps = {};

const DashboardPage: NextPage<ApiPageProps> = () => {
  const router = useRouter();
  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));

  const [activeApiKeys, setActiveApiKeys] = useState<
    UserFacingApiKeyProperties[]
  >([]);

  const [generateKeyStatus, setGenerateStatus] = useState<{
    showModal: boolean;
    keyToRegenerate?: UserFacingApiKeyProperties | undefined;
  }>({
    showModal: false,
  });

  const fetchAndSetApiKeys = () =>
    apiClient
      .getUserApiKeys()
      .then(({ data }) =>
        data
          ? setActiveApiKeys(
              data.apiKeysMetadata.filter((key) => !key.revokedAt),
            )
          : null,
      );

  useEffect(() => {
    /** @todo handle errors and show the user a msg */
    void fetchAndSetApiKeys();
  }, []);

  const tableRows: TableRows = useMemo(
    () =>
      activeApiKeys.map((key) => [
        key.displayName,
        key.publicId,
        key.lastUsedAt ? (
          <DateTimeCell key="lastUsed" timestamp={key.lastUsedAt} />
        ) : (
          "Never"
        ),
        <DateTimeCell key="createdAt" timestamp={key.createdAt} />,
      ]),

    [activeApiKeys],
  );
  const activeKey = activeApiKeys[0];

  const closeGenerateModal = () => {
    setGenerateStatus({
      showModal: false,
      keyToRegenerate: undefined,
    });
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
                  onClick={(event: MouseEvent) => {
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
            Access the API
          </Typography>

          <Box
            py={4}
            display={{ xs: "block", md: "flex" }}
            alignItems="flex-start"
          >
            <Box
              sx={{
                boxShadow:
                  "0px 4px 11px rgba(39, 50, 86, 0.04), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.08), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
                background: "white",
                width: "100%",
                borderRadius: 2,
              }}
              p={6}
            >
              <Typography
                sx={{
                  typography: "bpLargeText",
                  fontWeight: "500",
                }}
              >
                API Keys
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography
                  sx={{
                    typography: "bpBodyCopy",
                  }}
                >
                  These keys allow you to access the block protocol from within
                  your application.
                </Typography>
                <Typography
                  sx={{
                    typography: "bpBodyCopy",
                  }}
                >
                  Keep them private to prevent other people from accessing your
                  account. <br />
                  <Link href="/docs/embedding-blocks#discovering-blocks">
                    Learn More
                  </Link>
                </Typography>
              </Box>
              {!!tableRows.length && (
                <Table
                  header={["Name", "Public ID", "Last Used", "Created"]}
                  rows={tableRows}
                />
              )}

              <Box sx={{ paddingTop: 2 }}>
                <Button
                  color={activeKey ? "warning" : "gray"}
                  onClick={() =>
                    setGenerateStatus({
                      showModal: true,
                      keyToRegenerate: activeKey,
                    })
                  }
                  variant="tertiary"
                >
                  {activeKey ? (
                    <>
                      <WarningIcon
                        width="auto"
                        height="1em"
                        sx={{ fontSize: "1em", marginRight: 1 }}
                      />{" "}
                      Regenerate API Key
                    </>
                  ) : (
                    <>Create new key</>
                  )}
                </Button>

                {generateKeyStatus.showModal ? (
                  <GenerateApiModal
                    close={closeGenerateModal}
                    keyNameToRegenerate={
                      generateKeyStatus.keyToRegenerate?.displayName
                    }
                    refetchKeyList={fetchAndSetApiKeys}
                  />
                ) : null}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage;
