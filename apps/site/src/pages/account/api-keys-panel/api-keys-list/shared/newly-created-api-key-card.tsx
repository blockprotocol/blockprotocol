import { Box, BoxProps, Typography } from "@mui/material";

import { CopyToClipboardButton } from "../../../../../components/copy-to-clipboard-button";
import { CODE_FONT_FAMILY } from "../../../../../theme/typography";

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
        sx={({ palette }) => ({
          px: 2.75,
          py: 1.25,
          backgroundColor: "#FBF7FF",
          border: "1px solid",
          borderBottomWidth: 0,
          borderRadius: "8px 8px 0px 0px",
          borderColor: palette.purple[30],
        })}
      >
        <Typography
          sx={({ palette }) => ({
            fontSize: 14,
            color: palette.gray[80],
            maxWidth: "unset",
            display: "flex",
            flexWrap: "wrap",
          })}
        >
          <span style={{ fontWeight: 700, marginRight: "4px" }}>
            Your new API can be seen below.
          </span>
          Securely note it down, as you won’t be able to view it again:
        </Typography>
      </Box>
      <Box
        sx={({ palette }) => ({
          px: 2.75,
          py: 1.25,
          backgroundColor: palette.gray[10],
          border: "1px solid",
          borderRadius: "0px 0px 8px 8px",
          borderColor: palette.gray[30],
        })}
      >
        <Typography
          data-testid="api-key-value"
          sx={({ palette }) => ({
            color: palette.gray[80],
            fontSize: 14,
            maxWidth: "unset",
            mb: 1.25,
            wordBreak: "break-word",
            fontFamily: CODE_FONT_FAMILY,
          })}
        >
          {`${part1}.${part2}.`}
          <Box component="span" sx={{ color: "purple.700" }}>
            {part3}
          </Box>
        </Typography>
        <CopyToClipboardButton copyText={apiKey} />
      </Box>
    </Box>
  );
};
