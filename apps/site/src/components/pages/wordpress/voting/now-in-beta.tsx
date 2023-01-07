import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { HashIcon, WordPressIcon } from "../../../icons";
import { Link } from "../../../link";
import { ApplicationBadge } from "./application-badge";

export interface NowInBetaProps {
  faded: boolean;
}

export const NowInBeta: FunctionComponent<NowInBetaProps> = ({ faded }) => {
  return (
    <Box>
      <Typography
        sx={({ palette, breakpoints }) => ({
          fontSize: 16,
          color: palette.gray[90],
          mb: 3,
          lineHeight: 1,
          fontWeight: 900,
          textTransform: "uppercase",
          maxWidth: "unset",
          [breakpoints.up("lg")]: {
            textAlign: "left",
          },
        })}
      >
        Now in beta
      </Typography>

      <Box
        sx={({ breakpoints }) => ({
          display: "inline-flex",
          gap: 2,
          opacity: faded ? 0.4 : 1,
          transition: ({ transitions }) => transitions.create("opacity"),

          pr: 4.875,
          borderRight: ({ palette }) => `1px solid ${palette.gray[30]}`,

          [breakpoints.down("lg")]: {
            pr: 0,
            pb: 1.5,
            mb: 5,
            borderRightWidth: 0,
            borderBottom: ({ palette }) => `1px solid ${palette.gray[30]}`,
          },
        })}
      >
        <Link href="https://hash.ai">
          <ApplicationBadge icon={<HashIcon />} name="HASH" />
        </Link>
        <ApplicationBadge icon={<WordPressIcon />} name="WordPress" />
      </Box>
    </Box>
  );
};
