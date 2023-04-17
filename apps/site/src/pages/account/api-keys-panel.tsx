import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Box, Stack } from "@mui/material";
import { NextSeo } from "next-seo";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "../../components/button";
import { FontAwesomeIcon } from "../../components/icons";
import { Link } from "../../components/link";
import { PanelSection } from "../../components/pages/account/panel-section";
import { apiClient } from "../../lib/api-client";
import { ApiKeysContext } from "./api-keys-panel/api-keys-context";
import { ApiKeysEmptyState } from "./api-keys-panel/api-keys-empty-state";
import { ApiKeysList } from "./api-keys-panel/api-keys-list";
import { ApiKeysLoading } from "./api-keys-panel/api-keys-loading";
import {
  ApiKeyProps,
  ApiKeysContextValue,
  KeyActionStatus,
} from "./api-keys-panel/types";

export const ApiKeysPanel: FunctionComponent = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyProps[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(true);
  const [keyActionStatus, setKeyActionStatus] = useState<KeyActionStatus>();
  const [isCreatingNewKey, setIsCreatingNewKey] = useState(false);
  const [newlyCreatedKeyIds, setNewlyCreatedKeyIds] = useState<string[]>([]);

  const fetchAndSetApiKeys = useCallback(async () => {
    const { data } = await apiClient.getUserApiKeys();
    setApiKeysLoading(false);

    if (data) {
      setApiKeys(data.apiKeysMetadata.filter((key) => !key.revokedAt));
    }
  }, []);

  useEffect(() => {
    void fetchAndSetApiKeys();
    /** this useEffect meant to be only run once */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apiKeysContextValue: ApiKeysContextValue = useMemo(
    () => ({
      apiKeys,
      setApiKeys,
      isCreatingNewKey,
      setIsCreatingNewKey,
      newlyCreatedKeyIds,
      setNewlyCreatedKeyIds,
      keyActionStatus,
      setKeyActionStatus,
      fetchAndSetApiKeys,
    }),
    [
      apiKeys,
      setApiKeys,
      isCreatingNewKey,
      setIsCreatingNewKey,
      newlyCreatedKeyIds,
      setNewlyCreatedKeyIds,
      keyActionStatus,
      setKeyActionStatus,
      fetchAndSetApiKeys,
    ],
  );

  const shouldRenderEmptyState = !apiKeys.length && !isCreatingNewKey;

  return (
    <ApiKeysContext.Provider value={apiKeysContextValue}>
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
          {apiKeysLoading ? (
            <ApiKeysLoading />
          ) : shouldRenderEmptyState ? (
            <ApiKeysEmptyState />
          ) : (
            <ApiKeysList />
          )}

          {!isCreatingNewKey && !apiKeysLoading && (
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
    </ApiKeysContext.Provider>
  );
};
