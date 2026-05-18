import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";

import {
  isDocsVersion,
  LATEST_DOCS_VERSION,
} from "../../../lib/docs-versions";
import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";
import { LinkButton } from "../../link-button";

type CardCta = {
  href: string;
  label: string;
  icon: ReactNode;
};

type CardContent = {
  title: string;
  body: ReactNode;
  cta: CardCta;
};

/**
 * Pulls the version segment out of `/spec/<v>` or `/docs/<v>` paths. Returns
 * `null` when the path isn't versioned or the segment isn't a known version.
 */
const parseSpecVersionFromPath = (asPath: string) => {
  const segments = (asPath.split(/[?#]/)[0] ?? "")
    .split("/")
    .filter((segment) => segment !== "");

  if (segments[0] !== "spec") {
    return null;
  }

  const candidate = segments[1];
  return candidate && isDocsVersion(candidate) ? candidate : null;
};

const workingDraftContent: CardContent = {
  title: "This document is a working draft",
  body: (
    <>
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
    </>
  ),
  cta: {
    href: "https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/spec",
    label: "View the spec on GitHub",
    icon: <FontAwesomeIcon icon={faGithub} />,
  },
};

const buildOutdatedDraftContent = (viewedVersion: string): CardContent => ({
  title: "This document is an outdated draft",
  body: (
    <>
      You’re viewing version {viewedVersion} of the Block Protocol
      specification. A newer draft is available and supersedes the content on
      this page.
    </>
  ),
  cta: {
    href: `/spec/${LATEST_DOCS_VERSION}`,
    label: "View the latest version",
    icon: <FontAwesomeIcon icon={faArrowRight} />,
  },
});

export const GitHubInfoCard: FunctionComponent = () => {
  const { asPath } = useRouter();
  const viewedVersion = parseSpecVersionFromPath(asPath);
  const isOutdated =
    viewedVersion !== null && viewedVersion !== LATEST_DOCS_VERSION;

  const { title, body, cta } = isOutdated
    ? buildOutdatedDraftContent(viewedVersion)
    : workingDraftContent;

  return (
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
          {title}
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
          {body}
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
          href={cta.href}
          variant="primary"
          color="teal"
          size="small"
          startIcon={cta.icon}
          sx={{
            textTransform: "none",
          }}
        >
          {cta.label}
        </LinkButton>
      </Box>
    </Paper>
  );
};
