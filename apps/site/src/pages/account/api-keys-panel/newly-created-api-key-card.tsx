import { Box, BoxProps, Typography } from "@mui/material";

import { CODE_FONT_FAMILY } from "../../../theme/typography";
import { CopyToClipboardButton } from "./copy-to-clipboard-button";

export const NewlyCreatedApiKeyCard = ({
  apiKey,
  sx = [],
}: {
  apiKey: string;
  sx?: BoxProps["sx"];
}) => {
  const [part1, part2, part3] = apiKey.split(".");

  return (
    <Box sx={[{ width: "100%" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box
        sx={{
          px: 2.75,
          py: 1.25,
          backgroundColor: "#FBF7FF",
          border: "1px solid",
          borderBottomWidth: 0,
          borderRadius: "8px 8px 0px 0px",
          borderColor: "purple.30",
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            color: "gray.80",
            maxWidth: "unset",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: 700, marginRight: "4px" }}>
            Your new API can be seen below.
          </span>
          Securely note it down, as you won’t be able to view it again:
        </Typography>
      </Box>
      <Box
        sx={{
          px: 2.75,
          py: 1.25,
          backgroundColor: "gray.10",
          border: "1px solid",
          borderRadius: "0px 0px 8px 8px",
          borderColor: "gray.30",
        }}
      >
        <Typography
          sx={{
            color: "gray.80",
            fontSize: 14,
            maxWidth: "unset",
            mb: 1.25,
            lineBreak: "anywhere",
            fontFamily: CODE_FONT_FAMILY,
          }}
        >
          {`${part1}.${part2}.`}
          <Box component="span" color="purple.700">
            {part3}
          </Box>
        </Typography>
        <CopyToClipboardButton copyText={apiKey} />
      </Box>
    </Box>
  );
};
