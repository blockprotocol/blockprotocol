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

import { UserFacingApiKeyProperties } from "../../../lib/api/model/api-key.model";
import { apiClient } from "../../../lib/api-client";
import { ApiKeyCard } from "./api-key-card";
import { ApiKeyTableRow } from "./api-key-table-row";
import { MobileApiKeyItem } from "./mobile-api-key-item";

interface ApiKeysListProps {
  apiKeys: UserFacingApiKeyProperties[];
  onKeyRemoved: (publicId: string) => void;
  onKeyRenamed: (publicId: string, displayName: string) => void;
  isCreatingNewKey: boolean;
  newlyCreatedKeyId?: string;
  createKey: (displayName: string) => Promise<void>;
  closeNewKeyCard: () => void;
}

export const ApiKeysList = ({
  apiKeys,
  onKeyRemoved,
  onKeyRenamed,
  isCreatingNewKey,
  newlyCreatedKeyId,
  closeNewKeyCard,
  createKey,
}: ApiKeysListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [keyActionStatus, setKeyActionStatus] = useState<{
    publicId: string;
    action: "rename" | "revoke";
  }>();

  const revokeApiKey = async (publicId: string) => {
    const res = await apiClient.revokeApiKey({ publicId });

    if (res.error) {
      throw new Error(res.error.message);
    }

    setKeyActionStatus(undefined);
    onKeyRemoved(publicId);
  };

  const renameApiKey = async (publicId: string, displayName: string) => {
    await apiClient.updateApiKey({ publicId, displayName });
    setKeyActionStatus(undefined);
    onKeyRenamed(publicId, displayName);
  };

  const createKeyCard = (
    <ApiKeyCard
      onClose={closeNewKeyCard}
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
              newlyCreatedKeyId={newlyCreatedKeyId}
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
                newlyCreatedKeyId={newlyCreatedKeyId}
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
