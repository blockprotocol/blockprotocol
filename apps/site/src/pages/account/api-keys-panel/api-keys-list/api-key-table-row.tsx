import { Box, TableCell, TableRow, Typography } from "@mui/material";

import { CODE_FONT_FAMILY } from "../../../../theme/typography";
import { useApiKeys } from "../api-keys-context";
import { ApiKeyItemProps } from "../types";
import { RowActions } from "./api-key-table-row/row-actions";
import { formatDateForDisplay } from "./shared/format-date-for-display";
import { NewIndicator } from "./shared/new-indicator";
import { NewlyCreatedApiKeyCard } from "./shared/newly-created-api-key-card";

const MaskedPublicId = ({ publicId }: { publicId: string }) => {
  return (
    <Typography
      sx={{
        fontFamily: CODE_FONT_FAMILY,
        color: ({ palette }) => palette.gray[50],
        fontSize: 14,
        lineBreak: "anywhere",
      }}
    >
      b10ck5.
      <Box component="span" sx={{ color: ({ palette }) => palette.gray[90] }}>
        {publicId}
      </Box>
      .xxxxx
    </Typography>
  );
};

const DateText = ({ date }: { date?: Date | null }) => {
  const formattedDates = formatDateForDisplay(date);

  return (
    <Typography>
      {formattedDates.relative}
      <Typography
        sx={{ color: ({ palette }) => palette.gray[70], fontSize: 14 }}
      >
        {formattedDates.exact}
      </Typography>
    </Typography>
  );
};

export const ApiKeyTableRow = ({
  apiKey: { displayName, publicId, createdAt, lastUsedAt },
  fullKeyValue,
  renameApiKeyCard,
  revokeApiKeyCard,
  keyAction,
}: ApiKeyItemProps) => {
  const { setKeyActionStatus } = useApiKeys();
  const hasAction = !!keyAction;

  return (
    <TableRow>
      {hasAction ? (
        <TableCell colSpan={5}>
          {keyAction === "revoke" ? revokeApiKeyCard : renameApiKeyCard}
        </TableCell>
      ) : (
        <>
          <TableCell
            sx={{
              verticalAlign: fullKeyValue ? "top" : "inherit",
            }}
          >
            {displayName}
            {fullKeyValue && <NewIndicator />}
          </TableCell>

          {fullKeyValue ? (
            <TableCell colSpan={3}>
              <NewlyCreatedApiKeyCard apiKey={fullKeyValue} />
            </TableCell>
          ) : (
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
          )}

          <TableCell
            sx={{
              verticalAlign: fullKeyValue ? "top" : "inherit",
            }}
          >
            <RowActions
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
