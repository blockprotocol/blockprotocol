import { Box, Typography } from "@mui/material";

import { shouldAllowNpmBlockPublishing } from "../../../lib/config.js";
import { LinkButton } from "../../link-button.js";

export const BlockListEmptyState = () => {
  return (
    <Box textAlign="center">
      <Typography variant="bpHeading4">
        You haven't published a block yet
      </Typography>
      {shouldAllowNpmBlockPublishing && (
        <LinkButton sx={{ mt: 4 }} size="small" squared href="/blocks/publish">
          Publish a block
        </LinkButton>
      )}
    </Box>
  );
};
