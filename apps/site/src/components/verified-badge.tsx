import { Box, Tooltip, Typography } from "@mui/material";

import { VerifiedCheckmarkIcon } from "./icons/verified-checkmark-icon";

interface VerifiedBadgeProps {
  compact?: boolean;
}

export const VerifiedBadge = ({ compact }: VerifiedBadgeProps) => (
  <Tooltip title="This block is verified">
    {compact ? (
      <Box component="span">
        <VerifiedCheckmarkIcon sx={{ fontSize: 16, ml: 1.5 }} />
      </Box>
    ) : (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          borderRadius: 7.5,
          background: "#FBF7FF",
          paddingY: 0.25,
          paddingX: 1,
        }}
      >
        <Typography
          variant="bpMicroCopy"
          sx={{
            fontWeight: 600,
            fontSize: 13,
            lineHeight: "18px",
            textTransform: "uppercase",
            color: "#7A4FF5",
          }}
        >
          Verified
        </Typography>
        <VerifiedCheckmarkIcon sx={{ fontSize: "13px !important" }} />
      </Box>
    )}
  </Tooltip>
);
