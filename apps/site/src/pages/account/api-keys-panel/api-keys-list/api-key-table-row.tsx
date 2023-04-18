import { Box, TableCell, TableRow, Typography } from "@mui/material";

import { CODE_FONT_FAMILY } from "../../../../theme/typography";
import { useApiKeys } from "../api-keys-context";
import { ApiKeyItemProps } from "../types";
import { ApiKeyCard } from "./api-key-card";
import { RowActions } from "./api-key-table-row/row-actions";
import { RevokeApiKeyCard } from "./revoke-api-key-card";
import { formatDateForDisplay } from "./shared/format-date-for-display";
import { NewIndicator } from "./shared/new-indicator";
import { NewlyCreatedApiKeyCard } from "./shared/newly-created-api-key-card";
import { useKeyAction } from "./shared/use-key-action";

const MaskedPublicId = ({ publicId }: { publicId: string }) => {
  return (
    <Typography
      sx={{
        fontFamily: CODE_FONT_FAMILY,
        color: ({ palette }) => palette.gray[50],
        fontSize: 14,
        wordBreak: "break-word",
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
      <Box
        component="span"
        sx={{ color: ({ palette }) => palette.gray[70], fontSize: 14 }}
      >
        <br />
        {formattedDates.exact}
      </Box>
    </Typography>
  );
};

export const ApiKeyTableRow = ({
  apiKey: { displayName, publicId, createdAt, lastUsedAt },
  fullKeyValue,
}: ApiKeyItemProps) => {
  const [keyAction, setKeyAction] = useKeyAction();
  const { renameApiKey, revokeApiKey } = useApiKeys();

  const renameApiKeyCard = (
    <ApiKeyCard
      onClose={() => setKeyAction(undefined)}
      defaultValue={displayName}
      showDiscardButton
      submitTitle="Rename key"
      inputLabel="Rename your key"
      onSubmit={async (newDisplayName) =>
        renameApiKey(publicId, newDisplayName)
      }
    />
  );

  const revokeApiKeyCard = (
    <RevokeApiKeyCard
      onClose={() => setKeyAction(undefined)}
      displayName={displayName}
      onRevoke={async () => revokeApiKey(publicId)}
    />
  );

  return (
    <TableRow>
      {keyAction ? (
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
              onRename={() => setKeyAction("rename")}
              onRevoke={() => setKeyAction("revoke")}
            />
          </TableCell>
        </>
      )}
    </TableRow>
  );
};
