import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useMemo } from "react";

import { SparklesSolidIcon } from "../../../components/icons/sparkles-solid-icon";
import { UserFacingApiKeyProperties } from "../../../lib/api/model/api-key.model";
import { CODE_FONT_FAMILY } from "../../../theme/typography";
import { ApiKeyCard } from "./api-key-card";
import { ApiKeyTableRowActions } from "./api-key-table-row-actions";
import { NewlyCreatedApiKeyCard } from "./newly-created-api-key-card";
import { RevokeApiKeyCard } from "./revoke-api-key-card";
import { formatDateRelativeAndExact } from "./utils";

const MaskedPublicId = ({ publicId }: { publicId: string }) => {
  return (
    <Typography
      sx={{ fontFamily: CODE_FONT_FAMILY, color: "gray.50", fontSize: 14 }}
    >
      b10ck5.
      <Box component="span" sx={{ color: "gray.90" }}>
        {publicId}
      </Box>
      .xxxxx
    </Typography>
  );
};

const DateText = ({ date }: { date?: Date | null }) => {
  const formattedDates = formatDateRelativeAndExact(date);

  return (
    <Typography>
      {formattedDates.relative}
      <Typography sx={{ color: "gray.70", fontSize: 14 }}>
        {formattedDates.exact}
      </Typography>
    </Typography>
  );
};

export const NewIndicator = () => {
  return (
    <Typography
      variant="bpSmallCaps"
      sx={{
        color: "purple.70",
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      new
      <SparklesSolidIcon sx={{ color: "purple", fontSize: 15, ml: 0.5 }} />
    </Typography>
  );
};

export interface ApiKeyItemProps {
  apiKey: UserFacingApiKeyProperties;
  newlyCreatedKeyId?: string;
  revokeApiKey: (publicId: string) => Promise<void>;
  renameApiKey: (publicId: string, displayName: string) => Promise<void>;
  keyAction?: "rename" | "revoke";
  setKeyActionStatus: Dispatch<
    SetStateAction<
      | {
          publicId: string;
          action: "rename" | "revoke";
        }
      | undefined
    >
  >;
}

export const ApiKeyTableRow = ({
  apiKey: { displayName, publicId, createdAt, lastUsedAt },
  newlyCreatedKeyId,
  renameApiKey,
  revokeApiKey,
  keyAction,
  setKeyActionStatus,
}: ApiKeyItemProps) => {
  const hasAction = !!keyAction;

  const dismissKeyAction = () => setKeyActionStatus(undefined);

  const isNewlyCreated =
    newlyCreatedKeyId && newlyCreatedKeyId.includes(publicId);

  const coreCells = useMemo(() => {
    if (isNewlyCreated) {
      return (
        <TableCell colSpan={3}>
          <NewlyCreatedApiKeyCard apiKey={newlyCreatedKeyId} />
        </TableCell>
      );
    }

    return (
      <>
        <TableCell>
          <MaskedPublicId publicId={publicId} />
        </TableCell>
        <TableCell>
          <DateText date={lastUsedAt} />
        </TableCell>
        <TableCell>
          <DateText date={createdAt} />
        </TableCell>
      </>
    );
  }, [createdAt, lastUsedAt, publicId, newlyCreatedKeyId, isNewlyCreated]);

  return (
    <TableRow key={publicId}>
      {hasAction ? (
        <TableCell colSpan={5} sx={{ px: 0 }}>
          {keyAction === "revoke" ? (
            <RevokeApiKeyCard
              onClose={dismissKeyAction}
              displayName={displayName}
              onRevoke={async () => revokeApiKey(publicId)}
            />
          ) : (
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
          )}
        </TableCell>
      ) : (
        <>
          <TableCell sx={{ verticalAlign: isNewlyCreated ? "top" : "inherit" }}>
            {displayName}
            {isNewlyCreated && <NewIndicator />}
          </TableCell>

          {coreCells}

          <TableCell sx={{ verticalAlign: isNewlyCreated ? "top" : "inherit" }}>
            <ApiKeyTableRowActions
              id={publicId}
              onRename={() =>
                setKeyActionStatus({ publicId, action: "rename" })
              }
              onRevoke={() =>
                setKeyActionStatus({ publicId, action: "revoke" })
              }
            />
          </TableCell>
        </>
      )}
    </TableRow>
  );
};
