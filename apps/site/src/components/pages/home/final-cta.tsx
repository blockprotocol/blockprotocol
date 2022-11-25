import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Box, Fade, Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useUser } from "../../../context/user-context";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { apiClient } from "../../../lib/api-client";
import { ApiVerifyEmailRequestBody } from "../../../pages/api/verify-email.api";
import { Button } from "../../button";
import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";
import { CompleteSignupScreen } from "../../screens/complete-signup-screen";
import { SignupScreen } from "../../screens/signup-screen";
import {
  VerificationCodeInfo,
  VerificationCodeScreen,
} from "../../screens/verification-code-screen";

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

export const FinalCTA: NextPage = () => {
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
      if (user.isSignedUp && redirectPath && redirectPath !== "/") {
        void router.push({ pathname: redirectPath });
      } else if (currentScreen !== "CompleteSignup") {
        setEmail(user.email);
        setCurrentScreen("CompleteSignup");
      }
    }
  }, [user, router, currentScreen, redirectPath]);

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
      data-testid="final-cta"
      sx={{
        background:
          "radial-gradient(60% 100% at 50% 110%, #FFB172 -10%, #9482FF 40%, #84e0ff 110%) ",
        py: { xs: 8, lg: 14 },
        px: { xs: 2, lg: 0 },
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
            <SignupScreen
              autoFocus={false}
              initialEmail={email}
              onSignup={handleSignup}
            />
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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{
          maxWidth: {
            xs: 600,
            md: 420,
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
            xs: 4,
            sm: 6,
            md: 7,
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
                Any registered developer can build and publish blocks to the
                global Hub for other applications to embed.
              </>
            ),
            link: (
              <Link href="/docs/developing-blocks">
                Read the block builder guide
              </Link>
            ),
          },
          {
            heading: <>Add blocks to your app</>,
            subHeading: (
              <>
                Anyone with an existing application who wants to make their user
                interface extensible with interoperable blocks can sign up to
                use the protocol.
              </>
            ),
            link: (
              <Link href="/docs/embedding-blocks">
                Read the embedding app guide
              </Link>
            ),
          },
        ].map(({ heading, subHeading, link }, index) => (
          // eslint-disable-next-line react/no-array-index-key -- TODO fix this
          <Box key={index} display="flex" alignItems="flex-start">
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
