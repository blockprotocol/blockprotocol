import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

import { Button } from "../../../components/button";
import { CODE_FONT_FAMILY } from "../../../theme/typography";
import { ApiKeyCard } from "./api-key-card";
import { ApiKeyItemProps, NewIndicator } from "./api-key-table-row";
import { NewlyCreatedApiKeyCard } from "./newly-created-api-key-card";
import { RevokeApiKeyCard } from "./revoke-api-key-card";
import { formatDateRelativeAndExact } from "./utils";

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
          <Typography component="span" sx={{ fontSize: 14, color: "gray.70" }}>
            {valueDescription}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

const DateField = ({ label, date }: { label: string; date?: Date | null }) => {
  const formattedDates = formatDateRelativeAndExact(date);

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
      sx={[{ flex: 1 }, !!danger && { color: "red.70" }]}
    >
      {title}
    </Button>
  );
};

export const MobileApiKeyItem = ({
  apiKey: { displayName, publicId, createdAt, lastUsedAt },
  newlyCreatedKeyId,
  renameApiKey,
  revokeApiKey,
  keyAction,
  setKeyActionStatus,
}: ApiKeyItemProps) => {
  const dismissKeyAction = () => setKeyActionStatus(undefined);

  const isNewlyCreated =
    newlyCreatedKeyId && newlyCreatedKeyId.includes(publicId);

  if (keyAction === "rename") {
    return (
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
    );
  }

  if (keyAction === "revoke") {
    return (
      <RevokeApiKeyCard
        onClose={dismissKeyAction}
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
          {isNewlyCreated && <NewIndicator />}
        </Typography>

        {isNewlyCreated ? (
          <Field
            label="Full api key"
            value={
              <NewlyCreatedApiKeyCard
                apiKey={newlyCreatedKeyId}
                sx={{ mt: 0.5 }}
              />
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
                onClick={() =>
                  setKeyActionStatus({ publicId, action: "rename" })
                }
                title="Rename"
              />
              <ActionButton
                onClick={() =>
                  setKeyActionStatus({ publicId, action: "revoke" })
                }
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
