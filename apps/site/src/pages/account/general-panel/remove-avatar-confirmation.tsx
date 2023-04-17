import { Card, Stack, Typography } from "@mui/material";

import { Button } from "../../../components/button";

export const RemoveAvatarConfirmation = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Card
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: ({ palette }) => palette.gray[20],
        alignSelf: "center",
        width: "100%",
      }}
      elevation={2}
    >
      <Typography
        sx={{
          mb: 1.5,
          fontSize: 14,
          color: ({ palette }) => palette.gray[80],
        }}
      >
        Are you sure you want to delete your current profile picture?
      </Typography>
      <Stack gap={1} direction="row">
        <Button size="small" color="danger" squared onClick={onConfirm}>
          Delete
        </Button>
        <Button
          size="small"
          color="gray"
          squared
          variant="tertiary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Stack>
    </Card>
  );
};
