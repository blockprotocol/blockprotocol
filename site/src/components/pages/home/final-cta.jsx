import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Container,
  Fade,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { Button } from "../../button";
import {
  ArrowUpCircleIcon,
  FontAwesomeIcon,
  PullRequestIcon,
} from "../../icons";
import { Link } from "../../link";
import { SignupScreen } from "../../screens/signup-screen";

export const FinalCTA = () => {
  return (
    <Box
      sx={{
        background:
          "radial-gradient(60% 100% at 50% 110%, #FFB172 -10%, #9482FF 40%, #84e0ff 110%) ",
        py: 12,
        display: "flex",
        alignItems: {
          xs: "center",
          md: "stretch",
        },
        justifyContent: "center",
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      <Paper
        sx={{
          flexShrink: 0,
          width: "100%",
          maxWidth: "1100px",
          background: "white",
          border: "2px solid white",
          borderTopLeftRadius: "6px",
          borderBottomLeftRadius: {
            xs: 0,
            md: "6px",
          },
          borderTopRightRadius: {
            xs: "6px",
            md: 0,
          },
          borderBottomRightRadius: 0,
          padding: 2.5,
          maxWidth: 600,
          boxShadow:
            "0px 2.8px 2.2px rgba(37, 96, 184, 0.15), 0px 6.7px 5.3px rgba(37, 96, 184, 0.08), 0px 12.5px 10px rgba(37, 96, 184, 0.05), 0px 22.3px 17.9px rgba(37, 96, 184, 0.09), 0px 41.8px 33.4px rgba(37, 96, 184, 0.1), 0px 100px 80px rgba(37, 96, 184, 0.1)",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={(theme) => ({
            transition: theme.transitions.create("padding"),
            padding: {
              xs: theme.spacing(2, 0),
              sm: 4,
            },
          })}
        >
          <SignupScreen />
        </Box>
      </Paper>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{
          maxWidth: {
            xs: 600,
            md: 500,
          },
          width: "100%",
          borderTopRightRadius: {
            xs: "0px",
            md: "6px",
          },
          borderBottomRightRadius: "6px",
          borderBottomLeftRadius: {
            xs: "6px",
            md: "0px",
          },
          padding: {
            xs: 6,
            md: 6,
          },
          gridGap: "3rem",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.91) 33.6%, rgba(250, 251, 252, 0.38) 113.46%)",
        }}
      >
        {[
          {
            heading: <>Build your own blocks</>,
            subHeading: (
              <>
                Any developer can build and publish blocks to the global
                registry for other applications to embed.
              </>
            ),
            link: (
              <Link href="/docs/developing-blocks">
                Read the guide to building blocks
              </Link>
            ),
          },
          {
            heading: <>Add blocks to your app</>,
            subHeading: (
              <>
                Anyone with an existing application who wants to make their user
                interface extensible with interoperable blocks can use the
                protocol.
              </>
            ),
            link: (
              <Link href="/docs/embedding-blocks">Read the guide for apps</Link>
            ),
          },
        ].map(({ heading, subHeading, link }, i) => (
          <Box key={i} display="flex" alignItems="flex-start">
            <Box>
              <Typography
                variant="bpHeading4"
                mb={1}
                sx={{
                  color: ({ palette }) => palette.gray[90],
                  fontWeight: 400,
                  lineHeight: "1.25em",
                }}
              >
                {heading}
              </Typography>
              <Typography
                component="p"
                variant="bpSmallCopy"
                sx={{
                  color: ({ palette }) => palette.gray[80],
                  fontWeight: 400,
                  lineHeight: "1.5em",
                  marginBottom: 1,
                }}
              >
                {subHeading}
              </Typography>
              <Typography
                component="span"
                sx={{
                  lineHeight: "1.5em",
                  textDecoration: "none",
                  fontSize: "1rem",
                }}
              >
                {link}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
