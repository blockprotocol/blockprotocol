import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Box, Stack } from "@mui/material";
import { NextSeo } from "next-seo";
import { FunctionComponent, useCallback, useEffect, useState } from "react";

import { Button } from "../../../components/button";
import { FontAwesomeIcon } from "../../../components/icons";
import { Link } from "../../../components/link";
import { PanelSection } from "../../../components/pages/account/panel-section";
import { UserFacingApiKeyProperties } from "../../../lib/api/model/api-key.model";
import { apiClient } from "../../../lib/api-client";
import { ApiKeysEmptyState } from "./api-keys-empty-state";
import { ApiKeysList } from "./api-keys-list";

export const ApiKeysPanel: FunctionComponent = () => {
  const [activeApiKeys, setActiveApiKeys] = useState<
    UserFacingApiKeyProperties[]
  >([]);

  const [isCreatingNewKey, setIsCreatingNewKey] = useState(false);
  const [newlyCreatedKeyId, setNewlyCreatedKeyId] = useState<string>();

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
    void fetchAndSetApiKeys();
  }, []);

  const createKey = useCallback(async (displayName: string) => {
    const res = await apiClient.generateApiKey({ displayName });

    if (res.data) {
      await fetchAndSetApiKeys();
      setNewlyCreatedKeyId(res.data.apiKey);
      setIsCreatingNewKey(false);
    }
  }, []);

  const hasKeys = !!activeApiKeys.length;

  return (
    <>
      <NextSeo title="Block Protocol – API" />

      <Stack gap={5.25}>
        <PanelSection
          title="API Keys"
          description={
            <Box mb={2}>
              API keys allow you to access the Block Protocol from within other
              applications.
              <br />
              Keep them secret, like passwords, to prevent others from accessing
              your account.{" "}
              <Link href="/docs/hub/api" data-test-id="apiKeyLink">
                Learn more <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </Box>
          }
        >
          {hasKeys || isCreatingNewKey ? (
            <ApiKeysList
              apiKeys={activeApiKeys}
              onKeyRemoved={(publicId) => {
                setActiveApiKeys(
                  activeApiKeys.filter((key) => key.publicId !== publicId),
                );
              }}
              onKeyRenamed={(publicId, displayName) => {
                setActiveApiKeys(
                  activeApiKeys.map((key) =>
                    key.publicId === publicId ? { ...key, displayName } : key,
                  ),
                );
              }}
              createKey={createKey}
              newlyCreatedKeyId={newlyCreatedKeyId}
              isCreatingNewKey={isCreatingNewKey}
              closeNewKeyCard={() => setIsCreatingNewKey(false)}
            />
          ) : (
            <ApiKeysEmptyState />
          )}

          {!isCreatingNewKey && (
            <Button
              squared
              variant="tertiary"
              color="gray"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => setIsCreatingNewKey(true)}
              sx={(theme) => ({
                mt: 4,
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
              })}
            >
              Create new key
            </Button>
          )}
        </PanelSection>
      </Stack>
    </>
  );
};
