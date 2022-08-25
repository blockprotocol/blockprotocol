import { Box, Typography } from "@mui/material";

import { LinkButton } from "../../link-button";

export const BlockListEmptyState = () => {
  return (
    <Box textAlign="center">
      <Typography variant="bpHeading4" mb={4}>
        You haven't published a block yet
      </Typography>
      <LinkButton size="small" squared href="/blocks/publish">
        Publish a block
      </LinkButton>
    </Box>
  );
};
