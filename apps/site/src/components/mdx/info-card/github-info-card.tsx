import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Box, Paper, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { FontAwesomeIcon } from "../../icons/index.js";
import { Link } from "../../link.js";
import { LinkButton } from "../../link-button.js";

export const GitHubInfoCard: FunctionComponent = () => (
  <Paper
    variant="teal"
    className="github-info-card"
    data-testid="github-info-card"
    sx={{
      marginBottom: {
        xs: 3,
        md: 5,
      },
      padding: 3,
      display: "flex",
      alignItems: "stretch",
      flexDirection: {
        xs: "column",
        md: "row",
      },
      maxWidth: { xs: "100%", lg: "1012px" },
    }}
  >
    <Box
      mr={2}
      sx={{
        display: {
          xs: "none",
          md: "block",
        },
      }}
    >
      <FontAwesomeIcon
        sx={{
          color: ({ palette }) => palette.teal[600],
          fontSize: 18,
        }}
        icon={faExclamationTriangle}
      />
    </Box>
    <Box
      mr={2}
      flexGrow={1}
      sx={{
        marginBottom: {
          xs: 2,
          md: 0,
        },
      }}
    >
      <Typography
        variant="bpLargeText"
        sx={{
          fontSize: 18,
          fontWeight: 600,
          color: ({ palette }) => palette.teal[600],
        }}
        marginBottom={1}
      >
        This document is a working draft
      </Typography>
      <Typography
        variant="bpBodyCopy"
        sx={(theme) => ({
          color: theme.palette.teal[600],
          fontSize: 15,
          lineHeight: 1.5,
          a: {
            color: theme.palette.teal[600],
            borderColor: theme.palette.teal[600],
            ":hover": {
              color: theme.palette.teal[700],
              borderColor: theme.palette.teal[700],
            },
          },
        })}
        maxWidth="62ch"
      >
        This specification is currently in progress. We’re drafting it in public
        to gather feedback and improve the final document. If you have any
        suggestions or improvements you would like to add, or questions you
        would like to ask, feel free to submit a PR or open a discussion on{" "}
        <Link
          href="https://github.com/blockprotocol/blockprotocol"
          sx={{ ":focus-visible": { outlineColor: "currentcolor" } }}
        >
          our GitHub repo
        </Link>
        .
      </Typography>
    </Box>
    <Box
      display="flex"
      flexShrink={0}
      alignItems="flex-end"
      sx={{
        justifyContent: {
          xs: "center",
          sm: "flex-start",
        },
      }}
    >
      <LinkButton
        href="https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/docs/3_spec"
        variant="primary"
        color="teal"
        size="small"
        startIcon={<FontAwesomeIcon icon={faGithub} />}
        sx={{
          textTransform: "none",
        }}
      >
        View the spec on GitHub
      </LinkButton>
    </Box>
  </Paper>
);
