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
import { ApiKeyCard } from "./api-key-card";
import { ApiKeyTableRow } from "./api-key-table-row";
import { useApiKeys } from "./api-keys-context";
import { MobileApiKeyItem } from "./mobile-api-key-item";

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

  if (isMobile) {
    return (
      <Box>
        {apiKeys.map((data, index) => (
          <>
            <MobileApiKeyItem
              key={data.publicId}
              apiKey={data}
              newlyCreatedKeyIds={newlyCreatedKeyIds}
              renameApiKey={renameApiKey}
              revokeApiKey={revokeApiKey}
              keyAction={
                keyActionStatus?.publicId === data.publicId
                  ? keyActionStatus.action
                  : undefined
              }
              setKeyActionStatus={setKeyActionStatus}
            />

            <Box
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
                apiKey={data}
                newlyCreatedKeyIds={newlyCreatedKeyIds}
                renameApiKey={renameApiKey}
                revokeApiKey={revokeApiKey}
                keyAction={
                  keyActionStatus?.publicId === data.publicId
                    ? keyActionStatus.action
                    : undefined
                }
                setKeyActionStatus={setKeyActionStatus}
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
