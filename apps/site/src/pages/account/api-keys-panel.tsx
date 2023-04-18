import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Stack } from "@mui/material";
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
import { Spacer } from "../../components/spacer";
import { apiClient } from "../../lib/api-client";
import { ApiKeysContext } from "./api-keys-panel/api-keys-context";
import { ApiKeysEmptyState } from "./api-keys-panel/api-keys-empty-state";
import { ApiKeysList } from "./api-keys-panel/api-keys-list";
import { ApiKeysLoading } from "./api-keys-panel/api-keys-loading";
import { ApiKeyProps, ApiKeysContextValue } from "./api-keys-panel/types";

export const ApiKeysPanel: FunctionComponent = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyProps[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(true);
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
      newlyCreatedKeyIds,
      setNewlyCreatedKeyIds,
      fetchAndSetApiKeys,
    }),
    [
      apiKeys,
      setApiKeys,
      newlyCreatedKeyIds,
      setNewlyCreatedKeyIds,
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
            <>
              API keys allow you to access the Block Protocol from within other
              applications.
              <br />
              Keep them secret, like passwords, to prevent others from accessing
              your account.{" "}
              <Link href="/docs/hub/api" data-test-id="apiKeyLink">
                Learn more <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </>
          }
        >
          <Spacer height={2} />
          {apiKeysLoading ? (
            <ApiKeysLoading />
          ) : shouldRenderEmptyState ? (
            <ApiKeysEmptyState />
          ) : (
            <ApiKeysList
              isCreatingNewKey={isCreatingNewKey}
              onCreatingNewKeyChange={setIsCreatingNewKey}
            />
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
