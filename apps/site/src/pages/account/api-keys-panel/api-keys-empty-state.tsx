import { Box, Typography } from "@mui/material";

export const ApiKeysEmptyState = () => {
  return (
    <Box>
      <Typography fontWeight={700} lineHeight={1.5}>
        You currently do not have any keys.
        <Typography color="gray.60">
          Create a key to get started with the Block Protocol.
        </Typography>
      </Typography>
    </Box>
  );
};
