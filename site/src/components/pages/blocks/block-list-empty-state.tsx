import { Box, Typography } from "@mui/material";

import { shouldAllowBlockPublishing } from "../../../lib/config";
import { LinkButton } from "../../link-button";

export const BlockListEmptyState = () => {
  return (
    <Box textAlign="center">
      <Typography variant="bpHeading4">
        You haven't published a block yet
      </Typography>
      {shouldAllowBlockPublishing && (
        <LinkButton sx={{ mt: 4 }} size="small" squared href="/blocks/publish">
          Publish a block
        </LinkButton>
      )}
    </Box>
  );
};
