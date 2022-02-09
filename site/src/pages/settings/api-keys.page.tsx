import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

import { Link } from "../../components/Link";
import { GenerateApiModal } from "../../components/pages/dashboard/GenerateApiModal";

import { WarningIcon } from "../../components/icons";
import { Table, TableRows } from "../../components/Table";
import { UserFacingApiKeyProperties } from "../../lib/model/apiKey.model";
import { apiClient } from "../../lib/apiClient";
import { DateTimeCell } from "../../components/TableCells";
import { Button } from "../../components/Button";
import { TopNavigationTabs } from "../../components/pages/dashboard/TopNavigationTabs";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/authWall";

const ApiKeys: AuthWallPageContent = () => {
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
              p={{ xs: 3, md: 6 }}
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
                  sx={{
                    width: {
                      xs: "100%",
                      md: "auto",
                    },
                  }}
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

export default withAuthWall(ApiKeys);
