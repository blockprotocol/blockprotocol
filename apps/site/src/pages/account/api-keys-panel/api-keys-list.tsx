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
  const theme = useTheme();
  // using isMobile for conditional rendering on this page, since this page is not SSR, and has a loading state for now
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [newlyCreatedKeyIds, setNewlyCreatedKeyIds] = useState<string[]>([]);

  const createKey = async (displayName: string) => {
    const { data } = await apiClient.generateApiKey({ displayName });

    const newKeysRes = await apiClient.getUserApiKeys();
    const newKey = newKeysRes.data?.apiKeysMetadata.find((key) =>
      data?.apiKey.includes(key.publicId),
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

  if (isMobile) {
    return (
      <Box>
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
    );
  }

  return (
    <Box>
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
  );
};
