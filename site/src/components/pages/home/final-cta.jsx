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
import { SignupScreen } from "../../screens/signup-screen";

export const FinalCTA = () => {
  return (
    <Box
      sx={{
        background:
          "radial-gradient(60% 100% at 50% 110%, #FFB172 -10%, #9482FF 40%, #84e0ff 110%) ",
        borderBottom: "1px solid #eceaf1",
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
            xs: 2.5,
            md: 4,
          },
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.91) 33.6%, rgba(250, 251, 252, 0.38) 113.46%)",
        }}
      >
        {[
          {
            icon: (
              <ArrowUpCircleIcon
                sx={{
                  fontSize: 20,
                  color: ({ palette }) => palette.purple[700],
                }}
              />
            ),
            heading: <>Publish blocks to the block hub</>,
            subHeading: (
              <>
                Help make open source blocks and structured data avaliable to
                everyone on the web
              </>
            ),
          },
          {
            icon: (
              <PullRequestIcon
                sx={{
                  fontSize: 20,
                  color: ({ palette }) => palette.purple[700],
                }}
              />
            ),
            heading: <>Take part in a growing, open source community</>,
            subHeading: (
              <>
                Create open source, reusable blocks connected to rich data
                structures
              </>
            ),
          },
          {
            icon: (
              <FontAwesomeIcon
                icon={faUser}
                sx={{
                  fontSize: 20,
                  color: ({ palette }) => palette.purple[700],
                }}
              />
            ),
            heading: <>Claim your favorite username</>,
            subHeading: <>@pizza goes fast</>,
          },
        ].map(({ icon, heading, subHeading }, i) => (
          <Box key={i} mb={3} display="flex" alignItems="flex-start">
            <Box width={40} flexShrink={0}>
              {icon}
            </Box>
            <Box>
              <Typography
                variant="bpBodyCopy"
                mb={1}
                sx={{
                  color: ({ palette }) => palette.gray[90],
                  fontWeight: 600,
                  lineHeight: "1.25em",
                }}
              >
                {heading}
              </Typography>
              <Typography
                component="p"
                variant="bpSmallCopy"
                sx={{
                  color: ({ palette }) => palette.gray[70],
                  fontWeight: 400,
                  lineHeight: "1.5em",
                }}
              >
                {subHeading}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
