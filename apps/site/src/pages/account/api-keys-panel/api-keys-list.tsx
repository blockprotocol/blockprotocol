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

import { apiClient } from "../../../lib/api-client";
import { useApiKeys } from "./api-keys-context";
import { ApiKeyCard } from "./api-keys-list/api-key-card";
import { ApiKeysMemoizedItems } from "./api-keys-list/api-keys-memoized-items";

export const ApiKeysList = () => {
  const {
    apiKeys,
    isCreatingNewKey,
    setIsCreatingNewKey,
    setNewlyCreatedKeyIds,
    fetchAndSetApiKeys,
  } = useApiKeys();

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

  return (
    <>
      <Box
        sx={(theme) => ({
          [theme.breakpoints.up("md")]: { display: "none" },
        })}
      >
        <ApiKeysMemoizedItems apiKeys={apiKeys} mobile />

        {isCreatingNewKey && (
          <Box mt={3}>
            <Typography sx={{ mb: 2, fontWeight: 500, fontSize: 16 }}>
              Create new key
            </Typography>
            {createKeyCard}
          </Box>
        )}
      </Box>

      <Box
        sx={(theme) => ({
          [theme.breakpoints.down("md")]: { display: "none" },
        })}
      >
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
              <ApiKeysMemoizedItems apiKeys={apiKeys} />

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
