import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { useMemo } from "react";

import { SparklesSolidIcon } from "../../../components/icons/sparkles-solid-icon";
import { CODE_FONT_FAMILY } from "../../../theme/typography";
import { ApiKeyTableRowActions } from "./api-key-table-row-actions";
import { useApiKeys } from "./api-keys-context";
import { NewlyCreatedApiKeyCard } from "./newly-created-api-key-card";
import { ApiKeyItemProps } from "./types";
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

export const ApiKeyTableRow = ({
  apiKey: { displayName, publicId, createdAt, lastUsedAt },
  matchingNewlyCreatedKey,
  renameApiKeyCard,
  revokeApiKeyCard,
  keyAction,
}: ApiKeyItemProps) => {
  const { setKeyActionStatus } = useApiKeys();
  const hasAction = !!keyAction;

  const coreCells = useMemo(() => {
    if (matchingNewlyCreatedKey) {
      return (
        <TableCell colSpan={3}>
          <NewlyCreatedApiKeyCard apiKey={matchingNewlyCreatedKey} />
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
  }, [createdAt, lastUsedAt, publicId, matchingNewlyCreatedKey]);

  return (
    <TableRow key={publicId}>
      {hasAction ? (
        <TableCell colSpan={5} sx={{ px: 0 }}>
          {keyAction === "revoke" ? revokeApiKeyCard : renameApiKeyCard}
        </TableCell>
      ) : (
        <>
          <TableCell
            sx={{
              verticalAlign: matchingNewlyCreatedKey ? "top" : "inherit",
            }}
          >
            {displayName}
            {matchingNewlyCreatedKey && <NewIndicator />}
          </TableCell>

          {coreCells}

          <TableCell
            sx={{
              verticalAlign: matchingNewlyCreatedKey ? "top" : "inherit",
            }}
          >
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
