import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Paper, Box, Icon, Fade, Container } from "@mui/material";
import { apiClient } from "../lib/apiClient";
import { ApiLoginWithLoginCodeRequestBody } from "./api/loginWithLoginCode.api";
import { Button } from "../components/Button";
import { SendLoginCodeScreen } from "../components/Screens/SendLoginCodeScreen";
import { SerializedUser } from "../lib/api/model/user.model";
import { useUser } from "../context/UserContext";
import {
  VerificationCodeInfo,
  VerificationCodeScreen,
} from "../components/Screens/VerificationCodeScreen";

type LoginPageParsedUrlQuery = {
  redirectPath?: string;
  email?: string;
} & Partial<ApiLoginWithLoginCodeRequestBody>;

const toStringElseUndefined = (item: string | string[] | undefined) =>
  typeof item === "string" ? item : undefined;

const LoginPage: NextPage = () => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const parsedQuery = useMemo((): LoginPageParsedUrlQuery => {
    const { query } = router;

    return {
      redirectPath: toStringElseUndefined(query.redirectPath),
      email: toStringElseUndefined(query.email),
      userId: toStringElseUndefined(query.userId),
      verificationCodeId: toStringElseUndefined(query.verificationCodeId),
      code: toStringElseUndefined(query.code),
    };
  }, [router]);

  const [currentScreen, setCurrentScreen] = useState<
    "Email" | "VerificationCode"
  >("Email");

  const [email, setEmail] = useState<string>();
  const [redirectPath, setRedirectPath] = useState<string>();
  const [initialVerificationCode, setInitialVerificationCode] =
    useState<string>();
  const [verificationCodeInfo, setVerificationCodeInfo] = useState<
    VerificationCodeInfo | undefined
  >();

  useEffect(() => {
    if (Object.values(parsedQuery).filter((value) => !!value).length > 0) {
      if (parsedQuery.email) setEmail(parsedQuery.email);
      if (parsedQuery.redirectPath) setRedirectPath(parsedQuery.redirectPath);

      const { userId, verificationCodeId, code } = parsedQuery;

      if (parsedQuery.email && userId && verificationCodeId && code) {
        setVerificationCodeInfo({ userId, verificationCodeId });
        setInitialVerificationCode(code);
        setCurrentScreen("VerificationCode");
      }

      void router.replace(router.route, undefined, { shallow: true });
    }
  }, [parsedQuery, router]);

  const handleLoginCodeSent = (params: {
    verificationCodeInfo: VerificationCodeInfo;
    email: string;
  }) => {
    setVerificationCodeInfo(params.verificationCodeInfo);
    setEmail(params.email);
    setCurrentScreen("VerificationCode");
  };

  // Router reference invalidates after page load because isReady changes from false to true.
  // We also update redirectPath in useEffect, which changes its reference too. Avoiding both
  // variables inside handleLogin dependencies saves us from triggering multiple API calls.
  const redirectRef = useRef<() => void>(() => {});

  useEffect(() => {
    redirectRef.current = () => {
      void router.push(redirectPath ?? "/");
    };
  }, [router, redirectPath]);

  useEffect(() => {
    if (user) {
      redirectRef.current();
    }
  }, [user]);

  const handleLogin = useCallback(
    (loggedInUser: SerializedUser) => {
      if (!loggedInUser.isSignedUp) {
        /** @todo: redirect to signup page if user hasn't completed signup */
      }
      setUser(loggedInUser);
      redirectRef.current();
    },
    [setUser],
  );

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
          paddingTop: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            borderRadius: "6px",
            padding: 2.5,
            maxWidth: 600,
          }}
        >
          <Box
            marginTop="-3px"
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <Fade in={currentScreen !== "Email"}>
              <Box>
                <Button
                  onClick={() => setCurrentScreen("Email")}
                  variant="transparent"
                  startIcon={
                    <Icon sx={{ fontSize: 16 }} className="fas fa-arrow-left" />
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
              <SendLoginCodeScreen
                initialEmail={email}
                onLoginCodeSent={handleLoginCodeSent}
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
                onSubmit={handleLogin}
                onChangeEmail={() => setCurrentScreen("Email")}
                resend={apiClient.sendLoginCode}
                submit={apiClient.loginWithLoginCode}
              />
            ) : null}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
