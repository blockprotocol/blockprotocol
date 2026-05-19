import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Box, Container, Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import { FormEvent, useState } from "react";

import { Button } from "../components/button";
import {
  ArrowUpCircleIcon,
  FontAwesomeIcon,
  PullRequestIcon,
} from "../components/icons";
import { TextField } from "../components/text-field";
import { apiClient } from "../lib/api-client";

const SignupPausedNotice = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const { error } = await apiClient.signupNotify({
      email,
      signupLocation:
        typeof window === "undefined" ? undefined : window.location.href,
      referrer:
        typeof window === "undefined" ? undefined : window.document.referrer,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(
        error.message ?? "Something went wrong. Please try again later.",
      );
      return;
    }

    setStatus("success");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="bpHeading4" component="h1">
        New signups are paused
      </Typography>
      <Typography variant="bpSmallCopy" sx={{ color: "gray.70" }}>
        We&apos;ve temporarily paused new signups to the BP Hub while we focus
        on HASH. Enter your email address below to get notified when we re-open
        registration.
      </Typography>

      {status === "success" ? (
        <Box
          sx={({ palette }) => ({
            borderRadius: 1,
            backgroundColor: palette.green[20],
            color: palette.green[90],
            border: `1px solid ${palette.green[40]}`,
            px: 2,
            py: 1.5,
          })}
        >
          <Typography variant="bpSmallCopy" sx={{ color: "inherit" }}>
            You&apos;re on the list. We&apos;ll be in touch when registration
            re-opens.
          </Typography>
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            autoFocus
            fullWidth
            label="Email address"
            type="email"
            value={email}
            required
            onChange={(event) => {
              setEmail(event.target.value);
              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
            error={status === "error"}
            helperText={errorMessage ?? undefined}
          />
          <Button type="submit" loading={status === "submitting"}>
            Notify me
          </Button>
        </Box>
      )}
    </Box>
  );
};

const SignupPage: NextPage = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      flexGrow: 1,
      background:
        "radial-gradient(141.84% 147.92% at 50% 122.49%, #FFB172 0%, #9482FF 32.87%, #84E6FF 100%)",
    }}
  >
    <Container
      sx={{
        py: { xs: 8, md: 14 },
        display: "flex",
        alignItems: { xs: "center", md: "stretch" },
        justifyContent: "center",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Paper
        sx={{
          flexShrink: 0,
          width: "100%",
          borderTopLeftRadius: "6px",
          borderBottomLeftRadius: { xs: 0, md: "6px" },
          borderTopRightRadius: { xs: "6px", md: 0 },
          borderBottomRightRadius: 0,
          padding: { xs: 3.5, sm: 5 },
          maxWidth: 500,
        }}
      >
        <SignupPausedNotice />
      </Paper>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{
          maxWidth: { xs: 500, md: 400 },
          width: "100%",
          borderTopRightRadius: { xs: 0, md: "6px" },
          borderBottomRightRadius: "6px",
          borderBottomLeftRadius: { xs: "6px", md: 0 },
          padding: { xs: 2.5, md: 4 },
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.91) 33.6%, rgba(250, 251, 252, 0.38) 113.46%)",
        }}
      >
        {(
          [
            {
              icon: (
                <ArrowUpCircleIcon
                  sx={{
                    fontSize: 20,
                    color: ({ palette }) => palette.purple[700],
                  }}
                />
              ),
              heading: <>Publish blocks on the Hub</>,
              subHeading: (
                <>
                  Help make open source blocks and structured data available to
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
          ] as const
        ).map(({ icon, heading, subHeading }, i) => (
          // eslint-disable-next-line react/no-array-index-key
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
    </Container>
  </Box>
);

export default SignupPage;
