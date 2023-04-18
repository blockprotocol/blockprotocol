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
import { useState } from "react";

import { apiClient } from "../../../lib/api-client";
import { ApiKeyCard } from "./api-keys-list/api-key-card";
import { ApiKeysMemoizedItems } from "./api-keys-list/api-keys-memoized-items";
import { ApiKeyProps } from "./types";

interface ApiKeysListProps {
  apiKeys: ApiKeyProps[];
  isCreatingNewKey: boolean;
  closeCreateKeyCard: () => void;
  onKeyCreated: (newKey: ApiKeyProps) => void;
}

export const ApiKeysList = ({
  apiKeys,
  isCreatingNewKey,
  closeCreateKeyCard,
  onKeyCreated,
}: ApiKeysListProps) => {
  const [newlyCreatedKeyIds, setNewlyCreatedKeyIds] = useState<string[]>([]);

  const createKey = async (displayName: string) => {
    const { data } = await apiClient.generateApiKey({ displayName });

    const newKeysRes = await apiClient.getUserApiKeys();
    const newKey = newKeysRes.data?.apiKeysMetadata.find(
      (key) => key.displayName === displayName,
    );

    if (data && newKey) {
      onKeyCreated(newKey);
      setNewlyCreatedKeyIds((ids) => [...ids, data.apiKey]);
      closeCreateKeyCard();
    }
  };

  const createKeyCard = (
    <ApiKeyCard
      onClose={closeCreateKeyCard}
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
        <ApiKeysMemoizedItems
          apiKeys={apiKeys}
          mobile
          newlyCreatedKeyIds={newlyCreatedKeyIds}
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
              <ApiKeysMemoizedItems
                apiKeys={apiKeys}
                newlyCreatedKeyIds={newlyCreatedKeyIds}
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
