import { Box, Stack, Typography } from "@mui/material";
import { format, formatDistanceToNowStrict, isSameDay } from "date-fns";
import { ReactNode, useMemo } from "react";

import { Button } from "../../../components/button";
import { UserFacingApiKeyProperties } from "../../../lib/api/model/api-key.model";
import { CODE_FONT_FAMILY } from "../../../theme/typography";

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
  const formattedDates = useMemo<{ relative: string; exact: string }>(() => {
    if (!date) {
      return { relative: "Never", exact: "" };
    }

    const sameDay = isSameDay(date, Date.now());

    return {
      relative: formatDistanceToNowStrict(date, {
        addSuffix: true,
      }),
      exact: sameDay
        ? `${format(date, "kk:mm")} today`
        : format(date, "MMMM d yyyy"),
    };
  }, [date]);

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
  apiKey,
  onRename,
  onRevoke,
}: {
  apiKey: UserFacingApiKeyProperties;
  onRename: () => void;
  onRevoke: () => void;
}) => {
  const { createdAt, lastUsedAt, publicId, displayName } = apiKey;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack gap={2}>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
          {displayName}
        </Typography>

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

        <Field
          label="Actions"
          value={
            <Stack direction="row" gap={2} width="100%" mt={0.5}>
              <ActionButton onClick={onRename} title="Rename" />
              <ActionButton onClick={onRevoke} title="Revoke" danger />
            </Stack>
          }
        />
      </Stack>
    </Box>
  );
};
