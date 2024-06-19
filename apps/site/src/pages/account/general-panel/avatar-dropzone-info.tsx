import { Card, Typography } from "@mui/material";

export const AvatarDropzoneInfo = ({
  isReplacing,
}: {
  isReplacing: boolean;
}) => {
  return (
    <Card sx={{ width: 1, p: 2 }}>
      <Typography
        sx={{
          fontSize: 14,
          color: ({ palette }) => palette.gray[70],
          maxWidth: "unset",
        }}
      >
        Drag an image onto the tile to your left in order to upload.
        {isReplacing && (
          <span style={{ fontWeight: 700 }}>
            This will replace your current avatar.
          </span>
        )}
      </Typography>
    </Card>
  );
};
