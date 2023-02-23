import {
  faArrowLeft,
  faCodePullRequest,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Fade, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useUser } from "../../../context/user-context";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { apiClient } from "../../../lib/api-client";
import { ApiVerifyEmailRequestBody } from "../../../pages/api/verify-email.api";
import { Button } from "../../button";
import { FontAwesomeIcon } from "../../icons";
import { ArrowUpIcon } from "../../icons/arrow-up-icon";
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

type SignupPageScreen = (typeof SIGNUP_PAGE_SCREENS)[number];

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
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={(theme) => ({
          height: "100%",
          width: "100%",
          maxWidth: 600,
          transition: theme.transitions.create("padding"),
          padding: {
            xs: 4,
            lg: 12.5,
          },
          mb: 2,
        })}
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: {
            xs: "100%",
            md: "auto",
          },
          padding: {
            xs: 4,
            lg: 8,
          },
          background:
            "linear-gradient(180.32deg, #FFFFFF 22.26%, rgba(240, 231, 255, 0.38) 99.72%), #FFFFFF",
          borderStyle: "solid",
          borderColor: ({ palette }) => palette.purple[100],
          borderLeftWidth: { xs: 0, md: 1 },
          borderTopWidth: { xs: 1, md: 0 },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: 1,
            maxWidth: {
              xs: 600,
              md: 460,
            },
            gap: 2,
          }}
        >
          {[
            {
              heading: (
                <>
                  Publish blocks to the{" "}
                  <strong>
                    <Box
                      component="span"
                      sx={{ color: ({ palette }) => palette.purple[70] }}
                    >
                      Þ
                    </Box>{" "}
                    <Box
                      component="span"
                      sx={{ fontFamily: "colfax-web", fontStyle: "italic" }}
                    >
                      Hub
                    </Box>
                  </strong>
                </>
              ),
              subHeading: (
                <>
                  Create and use blocks that work in any application that
                  supports the protocol
                </>
              ),
              icon: (
                <ArrowUpIcon
                  sx={{
                    fontSize: 16,
                  }}
                />
              ),
            },
            {
              heading: <>Add blocks to your app</>,
              subHeading: (
                <>Access the open-source Hub and embed blocks you need</>
              ),
              icon: (
                <FontAwesomeIcon
                  sx={{
                    fontSize: 16,
                    fill: ({ palette }) => palette.purple[70],
                  }}
                  icon={faPlus}
                />
              ),
            },
            {
              heading: <>Take part in a growing, open source community</>,
              subHeading: (
                <>
                  Help make open source blocks avaliable to everyone on the web
                </>
              ),
              icon: (
                <FontAwesomeIcon
                  sx={{
                    fontSize: 16,
                    fill: ({ palette }) => palette.purple[70],
                  }}
                  icon={faCodePullRequest}
                />
              ),
            },
            {
              heading: <>Claim your favorite username</>,
              subHeading: <>@pizza goes fast 🍕</>,
              icon: (
                <FontAwesomeIcon
                  sx={{
                    fontSize: 16,
                    fill: ({ palette }) => palette.purple[70],
                  }}
                  icon={faUser}
                />
              ),
            },
          ].map(({ heading, subHeading, icon }, index) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key -- TODO fix this
              key={index}
              display="flex"
              alignItems="flex-start"
              gap={1.5}
              sx={{
                maxWidth: {
                  xs: 600,
                  lg: 460,
                },
              }}
            >
              <Box sx={{ lineHeight: "16px", position: "relative", top: 4 }}>
                {icon}
              </Box>
              <Box>
                <Typography
                  variant="bpSmallCopy"
                  sx={{
                    fontSize: "1.125rem",
                    fontWeight: 500,
                    lineHeight: 1.3,
                    mb: 1,
                  }}
                >
                  {heading}
                </Typography>

                <Typography
                  variant="bpSmallCopy"
                  component="p"
                  sx={{
                    color: ({ palette }) => palette.gray[70],
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  {subHeading}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
