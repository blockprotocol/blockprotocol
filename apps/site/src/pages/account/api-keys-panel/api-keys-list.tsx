import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { apiClient } from "../../../lib/api-client";
import { useApiKeys } from "./api-keys-context";
import { ApiKeyCard } from "./api-keys-list/api-key-card";
import { ApiKeyTableRow } from "./api-keys-list/api-key-table-row";
import { MobileApiKeyItem } from "./api-keys-list/mobile-api-key-item";
import { RevokeApiKeyCard } from "./api-keys-list/revoke-api-key-card";
import { ApiKeyItemProps, ApiKeyProps } from "./types";

export const ApiKeysList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    apiKeys,
    keyActionStatus,
    setKeyActionStatus,
    newlyCreatedKeyIds,
    isCreatingNewKey,
    setApiKeys,
    setIsCreatingNewKey,
    setNewlyCreatedKeyIds,
    fetchAndSetApiKeys,
  } = useApiKeys();

  const revokeApiKey = async (publicId: string) => {
    const res = await apiClient.revokeApiKey({ publicId });

    if (res.error) {
      throw new Error(res.error.message);
    }

    setKeyActionStatus(undefined);
    setApiKeys(apiKeys.filter((key) => key.publicId !== publicId));
  };

  const renameApiKey = async (publicId: string, displayName: string) => {
    await apiClient.updateApiKey({ publicId, displayName });
    setKeyActionStatus(undefined);
    setApiKeys(
      apiKeys.map((key) =>
        key.publicId === publicId ? { ...key, displayName } : key,
      ),
    );
  };

  const createKey = async (displayName: string) => {
    const { data } = await apiClient.generateApiKey({ displayName });

    if (data) {
      await fetchAndSetApiKeys();
      setNewlyCreatedKeyIds((ids) => [...ids, data.apiKey]);
      setIsCreatingNewKey(false);
    }
  };

  const createKeyCard = (
    <ApiKeyCard
      onClose={() => setIsCreatingNewKey(false)}
      onSubmit={createKey}
      submitTitle="Create key"
      inputLabel="Name your new key"
    />
  );

  const generateApiKeyItemProps = (data: ApiKeyProps): ApiKeyItemProps => {
    const dismissKeyAction = () => setKeyActionStatus(undefined);

    const { displayName, publicId } = data;
    return {
      apiKey: data,
      matchingNewlyCreatedKey: newlyCreatedKeyIds.find((key) =>
        key.includes(publicId),
      ),
      keyAction:
        keyActionStatus?.publicId === publicId
          ? keyActionStatus.action
          : undefined,
      renameApiKeyCard: (
        <ApiKeyCard
          onClose={dismissKeyAction}
          defaultValue={displayName}
          showDiscardButton
          submitTitle="Rename key"
          inputLabel="Rename your key"
          onSubmit={async (newDisplayName) =>
            renameApiKey(publicId, newDisplayName)
          }
        />
      ),
      revokeApiKeyCard: (
        <RevokeApiKeyCard
          onClose={dismissKeyAction}
          displayName={displayName}
          onRevoke={async () => revokeApiKey(publicId)}
        />
      ),
    };
  };

  if (isMobile) {
    return (
      <Box>
        {apiKeys.map((data, index) => (
          <>
            <MobileApiKeyItem
              key={data.publicId}
              {...generateApiKeyItemProps(data)}
            />

            <Box
              key={`${data.publicId}-divider`}
              sx={{
                mt: 3,
                mb: index < apiKeys.length - 1 ? 3 : 0,
                borderTop: "1px solid",
                borderColor: "gray.30",
              }}
            />
          </>
        ))}

        {isCreatingNewKey && (
          <Box mt={3}>
            <Typography sx={{ mb: 2, fontWeight: 500, fontSize: 16 }}>
              Create new key
            </Typography>
            {createKeyCard}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {apiKeys.length ? (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>Token</TableCell>
                  <TableCell>Last Used</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell />
                </>
              ) : (
                <TableCell colSpan={5}>Choose a name</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {apiKeys.map((data) => (
              <ApiKeyTableRow
                key={data.publicId}
                {...generateApiKeyItemProps(data)}
              />
            ))}
            {isCreatingNewKey && (
              <TableRow>
                <TableCell sx={{ verticalAlign: "top" }}>New Key</TableCell>
                <TableCell colSpan={4} sx={{ px: 0 }}>
                  {createKeyCard}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
