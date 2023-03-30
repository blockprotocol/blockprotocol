import { Box, Typography } from "@mui/material";
import { NextSeo } from "next-seo";
import { FunctionComponent, useEffect, useMemo, useState } from "react";

import { Button } from "../../components/button";
import { Link } from "../../components/link";
import { GenerateApiModal } from "../../components/pages/dashboard/generate-api-modal";
import { Table, TableRows } from "../../components/table";
import { DateTimeCell } from "../../components/table-cells";
import { UserFacingApiKeyProperties } from "../../lib/api/model/api-key.model";
import { apiClient } from "../../lib/api-client";

export const ApiKeysPanel: FunctionComponent = () => {
  const [activeApiKeys, setActiveApiKeys] = useState<
    UserFacingApiKeyProperties[]
  >([]);

  const [generateKeyStatus, setGenerateStatus] = useState<{
    showModal: boolean;
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

  const closeGenerateModal = () => {
    setGenerateStatus({
      showModal: false,
    });
  };

  return (
    <>
      <NextSeo title="Block Protocol – Dashboard" />

      <Typography variant="bpHeading2" sx={{ fontSize: 28, fontWeight: 400 }}>
        API Keys
      </Typography>
      <Box sx={{ my: 2 }}>
        <Typography
          sx={{
            typography: "bpBodyCopy",
          }}
        >
          These keys allow you to access the Block Protocol from within other
          applications.
        </Typography>
        <Typography
          sx={{
            typography: "bpBodyCopy",
          }}
        >
          Keep them private to prevent other people from accessing your account.{" "}
          <br />
          <Link href="/docs#th-hub-and-api" data-test-id="apiKeyLink">
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
          color="gray"
          onClick={() =>
            setGenerateStatus({
              showModal: true,
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
          Create new key
        </Button>

        {generateKeyStatus.showModal ? (
          <GenerateApiModal
            close={closeGenerateModal}
            refetchKeyList={fetchAndSetApiKeys}
          />
        ) : null}
      </Box>
    </>
  );
};
