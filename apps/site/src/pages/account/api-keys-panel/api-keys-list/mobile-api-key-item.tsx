import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

import { Button } from "../../../../components/button";
import { CODE_FONT_FAMILY } from "../../../../theme/typography";
import { useApiKeys } from "../api-keys-context";
import { ApiKeyItemProps } from "../types";
import { ApiKeyCard } from "./api-key-card";
import { RevokeApiKeyCard } from "./revoke-api-key-card";
import { formatDateForDisplay } from "./shared/format-date-for-display";
import { NewIndicator } from "./shared/new-indicator";
import { NewlyCreatedApiKeyCard } from "./shared/newly-created-api-key-card";
import { useKeyAction } from "./shared/use-key-action";

const Field = ({
  label,
  value,
  valueDescription,
}: {
  label: string;
  value: ReactNode | string;
  valueDescription?: string;
}) => {
  return (
    <Box>
      <Typography variant="bpSmallCaps" sx={{ fontWeight: 500, fontSize: 14 }}>
        {label}
      </Typography>

      <Stack direction="row" gap={2} alignItems="center">
        {typeof value === "string" ? (
          <Typography sx={{ fontSize: 16 }}>{value}</Typography>
        ) : (
          value
        )}
        {!!valueDescription && (
          <Typography
            component="span"
            sx={{ fontSize: 14, color: ({ palette }) => palette.gray[70] }}
          >
            {valueDescription}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

const DateField = ({ label, date }: { label: string; date?: Date | null }) => {
  const formattedDates = formatDateForDisplay(date);

  return (
    <Field
      label={label}
      value={formattedDates.relative}
      valueDescription={formattedDates.exact}
    />
  );
};

const ActionButton = ({
  onClick,
  title,
  danger,
}: {
  title: string;
  onClick: () => void;
  danger?: boolean;
}) => {
  return (
    <Button
      onClick={onClick}
      variant="tertiary"
      squared
      color="gray"
      sx={[
        { flex: 1 },
        !!danger && { color: ({ palette }) => palette.red[70] },
      ]}
    >
      {title}
    </Button>
  );
};

export const MobileApiKeyItem = ({
  apiKey: { displayName, publicId, createdAt, lastUsedAt },
  fullKeyValue,
}: ApiKeyItemProps) => {
  const [keyAction, setKeyAction] = useKeyAction();
  const { renameApiKey, revokeApiKey } = useApiKeys();

  if (keyAction === "rename") {
    return (
      <ApiKeyCard
        onClose={() => setKeyAction(undefined)}
        defaultValue={displayName}
        showDiscardButton
        submitTitle="Rename key"
        inputLabel="Rename your key"
        onSubmit={async (newDisplayName) => {
          await renameApiKey(publicId, newDisplayName);
          setKeyAction(undefined);
        }}
      />
    );
  }

  if (keyAction === "revoke") {
    return (
      <RevokeApiKeyCard
        onClose={() => setKeyAction(undefined)}
        displayName={displayName}
        onRevoke={async () => revokeApiKey(publicId)}
      />
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack gap={2}>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {displayName}
          {fullKeyValue && <NewIndicator />}
        </Typography>

        {fullKeyValue ? (
          <Field
            label="Full api key"
            value={
              <NewlyCreatedApiKeyCard apiKey={fullKeyValue} sx={{ mt: 0.5 }} />
            }
          />
        ) : (
          <>
            <Field
              label="Api key public ID"
              value={
                <Typography sx={{ fontFamily: CODE_FONT_FAMILY, fontSize: 16 }}>
                  {publicId}
                </Typography>
              }
            />
            <DateField label="Last used" date={lastUsedAt} />
            <DateField label="Created" date={createdAt} />
          </>
        )}

        <Field
          label="Actions"
          value={
            <Stack direction="row" gap={2} width="100%" mt={0.5}>
              <ActionButton
                onClick={() => setKeyAction("rename")}
                title="Rename"
              />
              <ActionButton
                onClick={() => setKeyAction("revoke")}
                title="Revoke"
                danger
              />
            </Stack>
          }
        />
      </Stack>
    </Box>
  );
};
