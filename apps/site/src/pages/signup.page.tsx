import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { Box, Container, Fade, Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { Button } from "../components/button";
import {
  ArrowUpCircleIcon,
  FontAwesomeIcon,
  PullRequestIcon,
} from "../components/icons";
import { CompleteSignupScreen } from "../components/screens/complete-signup-screen";
import { SignupScreen } from "../components/screens/signup-screen";
import {
  VerificationCodeInfo,
  VerificationCodeScreen,
} from "../components/screens/verification-code-screen";
import { useUser } from "../context/user-context";
import { SerializedUser } from "../lib/api/model/user.model";
import { apiClient } from "../lib/api-client";
import { ApiVerifyEmailRequestBody } from "./api/verify-email.api";

const SIGNUP_PAGE_SCREENS = [
  "Email",
  "VerificationCode",
  "CompleteSignup",
] as const;

type SignupPageScreen = typeof SIGNUP_PAGE_SCREENS[number];

type SignupPageParsedUrlQuery = {
  redirectPath?: string;
  email?: string;
} & Partial<ApiVerifyEmailRequestBody>;

const toStringElseUndefined = (item: string | string[] | undefined) =>
  typeof item === "string" ? item : undefined;

const SignupPage: NextPage = () => {
  const router = useRouter();

  const parsedQuery = useMemo((): SignupPageParsedUrlQuery => {
    const { query } = router;

    return {
      redirectPath: toStringElseUndefined(query.redirectPath),
      email: toStringElseUndefined(query.email),
      userId: toStringElseUndefined(query.userId),
      verificationCodeId: toStringElseUndefined(query.verificationCodeId),
      code: toStringElseUndefined(query.code),
    };
  }, [router]);

  const { user, setUser } = useUser();
  const [currentScreen, setCurrentScreen] = useState<SignupPageScreen>("Email");

  const [email, setEmail] = useState<string>();
  const [redirectPath, setRedirectPath] = useState<string>();
  const [initialVerificationCode, setInitialVerificationCode] =
    useState<string>();

  const [verificationCodeInfo, setVerificationCodeInfo] = useState<
    VerificationCodeInfo | undefined
  >();

  useEffect(() => {
    if (Object.values(parsedQuery).filter((value) => !!value).length > 0) {
      if (parsedQuery.email) {
        setEmail(parsedQuery.email);
      }
      if (parsedQuery.redirectPath) {
        setRedirectPath(parsedQuery.redirectPath);
      }

      const { userId, verificationCodeId, code } = parsedQuery;

      if (parsedQuery.email && userId && verificationCodeId && code) {
        setVerificationCodeInfo({ userId, verificationCodeId });
        setInitialVerificationCode(code);
        setCurrentScreen("VerificationCode");
      }

      void router.replace({ pathname: router.pathname }, undefined, {
        shallow: true,
      });
    }
  }, [parsedQuery, router]);

  useEffect(() => {
    if (user && user !== "loading") {
      if (user.isSignedUp) {
        void router.push({ pathname: redirectPath ?? "/dashboard" });
      } else if (currentScreen !== "CompleteSignup") {
        setEmail(user.email);
        setCurrentScreen("CompleteSignup");
      }
    }
  }, [user, router, currentScreen, redirectPath]);

  const displayInfoSidebar =
    currentScreen === "Email" || currentScreen === "VerificationCode";

  const handleSignup = (params: {
    verificationCodeInfo: VerificationCodeInfo;
    email: string;
  }) => {
    setVerificationCodeInfo(params.verificationCodeInfo);
    setEmail(params.email);
    setCurrentScreen("VerificationCode");
  };

  const handleVerificationCodeSubmitted = (loggedInUser: SerializedUser) => {
    setUser(loggedInUser);
  };

  return (
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
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: {
              xs: `${displayInfoSidebar ? 0 : 6}px`,
              md: "6px",
            },
            borderTopRightRadius: {
              xs: "6px",
              md: `${displayInfoSidebar ? 0 : 6}px`,
            },
            borderBottomRightRadius: `${displayInfoSidebar ? 0 : 6}px`,
            padding: 2.5,
            maxWidth: 500,
          }}
        >
          <Box
            marginTop="-3px"
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <Fade in={currentScreen === "VerificationCode"}>
              <Box>
                <Button
                  onClick={() => setCurrentScreen("Email")}
                  disabled={currentScreen === SIGNUP_PAGE_SCREENS[0]}
                  variant="transparent"
                  startIcon={
                    <FontAwesomeIcon icon={faArrowLeft} sx={{ fontSize: 16 }} />
                  }
                  sx={{
                    fontSize: 15,
                  }}
                >
                  Back
                </Button>
              </Box>
            </Fade>
          </Box>
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
            {currentScreen === "Email" ? (
              <SignupScreen initialEmail={email} onSignup={handleSignup} />
            ) : null}
            {currentScreen === "VerificationCode" &&
            verificationCodeInfo &&
            email ? (
              <VerificationCodeScreen
                verificationCodeInfo={verificationCodeInfo}
                email={email}
                setVerificationCodeId={(verificationCodeId) => {
                  setVerificationCodeInfo({
                    ...verificationCodeInfo,
                    verificationCodeId,
                  });
                }}
                initialVerificationCode={initialVerificationCode}
                onSubmit={handleVerificationCodeSubmitted}
                onChangeEmail={() => setCurrentScreen("Email")}
                submit={apiClient.verifyEmail}
                resend={apiClient.signup}
              />
            ) : null}
            {currentScreen === "CompleteSignup" && email ? (
              <CompleteSignupScreen email={email} />
            ) : null}
          </Box>
        </Paper>
        {displayInfoSidebar ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{
              maxWidth: {
                xs: 500,
                md: 400,
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
                      Help make open source blocks and structured data available
                      to everyone on the web
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
        ) : null}
      </Container>
    </Box>
  );
};

export default SignupPage;
