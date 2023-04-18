import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback } from "react";

import { apiClient } from "../../../lib/api-client";
import { useApiKeys } from "./api-keys-context";
import { ApiKeyCard } from "./api-keys-list/api-key-card";
import { ApiKeysMemoList } from "./api-keys-list/api-keys-memo-list";

export const ApiKeysList = ({
  isCreatingNewKey,
  onCreatingNewKeyChange,
}: {
  isCreatingNewKey: boolean;
  onCreatingNewKeyChange: (isCreatingNewKey: boolean) => void;
}) => {
  const { apiKeys, setNewlyCreatedKeyIds, fetchAndSetApiKeys, setApiKeys } =
    useApiKeys();

  const createKey = async (displayName: string) => {
    const { data } = await apiClient.generateApiKey({ displayName });

    if (data) {
      await fetchAndSetApiKeys();
      setNewlyCreatedKeyIds((ids) => [...ids, data.apiKey]);
      onCreatingNewKeyChange(false);
    }
  };

  const createKeyCard = (
    <ApiKeyCard
      onClose={() => onCreatingNewKeyChange(false)}
      onSubmit={createKey}
      submitTitle="Create key"
      inputLabel="Name your new key"
    />
  );

  // @todo move into context
  const revokeApiKey = useCallback(
    async (publicId: string) => {
      const res = await apiClient.revokeApiKey({ publicId });

      if (res.error) {
        throw new Error(res.error.message);
      }

      setApiKeys(apiKeys.filter((key) => key.publicId !== publicId));
    },
    [apiKeys, setApiKeys],
  );

  // @todo move into context
  const renameApiKey = useCallback(
    async (publicId: string, displayName: string) => {
      await apiClient.updateApiKey({ publicId, displayName });
      setApiKeys(
        apiKeys.map((key) =>
          key.publicId === publicId ? { ...key, displayName } : key,
        ),
      );
    },
    [apiKeys, setApiKeys],
  );

  return (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <ApiKeysMemoList
          apiKeys={apiKeys}
          mobile
          onRename={renameApiKey}
          onRevoke={revokeApiKey}
        />
        {isCreatingNewKey && (
          <Box mt={3}>
            <Typography sx={{ mb: 2, fontWeight: 500, fontSize: 16 }}>
              Create new key
            </Typography>
            {createKeyCard}
          </Box>
        )}
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <TableContainer>
          <Table>
            <TableHead
              sx={{
                th: {
                  pl: 0,
                  py: 1,
                  color: ({ palette }) => palette.gray[80],
                  fontSize: 14,
                },
              }}
            >
              <TableRow>
                {apiKeys.length ? (
                  <>
                    <TableCell sx={{ width: 130 }}>Name</TableCell>
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
            <TableBody
              sx={{
                td: {
                  color: ({ palette }) => palette.gray[90],
                  pl: 0,
                  fontWeight: 500,
                },
              }}
            >
              <ApiKeysMemoList
                apiKeys={apiKeys}
                onRename={renameApiKey}
                onRevoke={revokeApiKey}
              />
              {isCreatingNewKey && (
                <TableRow>
                  <TableCell sx={{ verticalAlign: "top" }}>New Key</TableCell>
                  <TableCell colSpan={4}>{createKeyCard}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
