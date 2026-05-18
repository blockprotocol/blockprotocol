import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Box, Paper, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";

type DeprecatedPageBannerProps = {
  /**
   * Absolute path of the newest version that still defines this page (and
   * explains what replaced it). The whole banner links here.
   */
  noticeHref: string;
};

/**
 * Banner shown above the MDX content of a docs/spec page that has been
 * removed in a subsequent version of the protocol. Surfaces a one-click
 * route to the most-recent version of the same slug, which carries the
 * explanatory deprecation notice.
 */
export const DeprecatedPageBanner: FunctionComponent<
  DeprecatedPageBannerProps
> = ({ noticeHref }) => (
  <Box marginBottom={4}>
    <Link
      href={noticeHref}
      sx={{
        display: "block",
        textDecoration: "none",
        borderBottom: "none",
        ":hover": { borderBottom: "none" },
      }}
    >
      <Paper
        variant="purple"
        role="alert"
        sx={(theme) => ({
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          padding: { xs: 2, sm: 2.5 },
          transition: theme.transitions.create([
            "background-color",
            "border-color",
          ]),
          ":hover": {
            backgroundColor: theme.palette.purple[200],
            borderColor: theme.palette.purple[300],
          },
        })}
      >
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          sx={(theme) => ({
            color: theme.palette.purple[600],
            fontSize: 22,
            marginTop: "2px",
            flexShrink: 0,
          })}
        />
        <Box>
          <Typography
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: 15,
              color: theme.palette.purple[700],
              lineHeight: 1.45,
            })}
          >
            This page no longer exists in the latest version of the Block
            Protocol spec.
          </Typography>
          <Typography
            sx={(theme) => ({
              marginTop: 0.5,
              fontSize: 15,
              color: theme.palette.purple[600],
              lineHeight: 1.45,
              "& span": {
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                fontWeight: 500,
              },
            })}
          >
            <span>Click here</span> to see an explanation.
          </Typography>
        </Box>
      </Paper>
    </Link>
  </Box>
);
