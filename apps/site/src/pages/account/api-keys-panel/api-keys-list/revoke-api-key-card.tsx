import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { Button } from "../../../../components/button";
import { useSnackbar } from "../../../../components/hooks/use-snackbar";
import { WarningIcon } from "../../../../components/icons";
import { TrashIcon } from "../../../../components/icons/trash-icon";
import { ColoredCard } from "./shared/colored-card";

interface RevokeApiKeyCardProps {
  onClose: () => void;
  onRevoke: () => Promise<void>;
  displayName: string;
}

export const RevokeApiKeyCard = ({
  displayName,
  onClose,
  onRevoke,
}: RevokeApiKeyCardProps) => {
  const [loading, setLoading] = useState(false);

  const snackbar = useSnackbar();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onRevoke();
      snackbar.info("Key revoked successfully");
    } catch {
      setLoading(false);
      snackbar.error("Failed to revoke key, please try again later");
    }
  };

  return (
    <ColoredCard color="red" onClose={onClose}>
      <Typography sx={{ fontWeight: 700, color: "black" }}>
        <WarningIcon
          sx={{
            color: ({ palette }) => palette.red[80],
            fontSize: 18,
            mt: -0.5,
            mr: 1.5,
          }}
        />
        You are about to revoke{" "}
        <Box component="span" sx={{ color: "red.80" }}>
          {displayName}
        </Box>
      </Typography>

      <Typography
        sx={{
          color: "gray.80",
          fontSize: 14,
          maxWidth: "unset",
          mb: 2,
        }}
      >
        Any applications which rely on this key may become broken.{" "}
        <span style={{ fontWeight: 700 }}>
          Are you sure you want to revoke it?
        </span>
      </Typography>

      <Stack
        sx={(theme) => ({
          flexDirection: "row",
          gap: 2.5,
          alignItems: "flex-end",

          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            gap: 1.5,
            alignItems: "stretch",
          },
        })}
      >
        <Button
          loading={loading}
          onClick={handleSubmit}
          color="danger"
          squared
          endIcon={<TrashIcon />}
        >
          Yes, I'm sure
        </Button>
        <Button
          onClick={onClose}
          color="gray"
          variant="secondary"
          squared
          sx={{
            color: "black",
            "&:before": {
              borderColor: ({ palette }) => palette.gray[30],
            },
          }}
        >
          No, keep key
        </Button>
      </Stack>
    </ColoredCard>
  );
};
