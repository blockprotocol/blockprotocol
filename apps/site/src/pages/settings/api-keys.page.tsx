import { Box, Typography } from "@mui/material";
import { NextSeo } from "next-seo";
import { useEffect, useMemo, useState } from "react";

import { Button } from "../../components/button.js";
import { WarningIcon } from "../../components/icons/index.js";
import { Link } from "../../components/link.js";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/auth-wall.js";
import { GenerateApiModal } from "../../components/pages/dashboard/generate-api-modal.js";
import { PageContainer } from "../../components/pages/dashboard/page-container.js";
import { TopNavigationTabs } from "../../components/pages/dashboard/top-navigation-tabs.js";
import { Table, TableRows } from "../../components/table.js";
import { DateTimeCell } from "../../components/table-cells.js";
import { UserFacingApiKeyProperties } from "../../lib/api/model/api-key.model.js";
import { apiClient } from "../../lib/api-client.js";

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
      <NextSeo title="Block Protocol – Dashboard" />

      <TopNavigationTabs />

      <PageContainer>
        <Typography variant="bpTitle" mb={2}>
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
      </PageContainer>
    </>
  );
};

export default withAuthWall(ApiKeys);
