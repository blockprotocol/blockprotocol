import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, ReactNode, useMemo, useContext } from "react";
import { Paper, Box, Icon, Fade, Container } from "@mui/material";
import { ParsedUrlQuery } from "querystring";
import { apiClient } from "../lib/apiClient";
import {
  ApiLoginWithLoginCodeRequestBody,
  ApiLoginWithLoginCodeResponse,
} from "./api/loginWithLoginCode.api";
import { Button } from "../components/Button";
import {
  LoginInfo,
  LoginWithLoginCodeScreen,
} from "../components/Modal/LoginWithLoginCodeScreen";
import { SendLoginCodeScreen } from "../components/Modal/SendLoginCodeScreen";
import { SerializedUser } from "../lib/model/user.model";
import UserContext from "../context/UserContext";

type LoginPageParsedUrlQuery = {
  redirectAsPath?: string;
  email: string;
} & ApiLoginWithLoginCodeRequestBody;

const tbdIsLoginPageParsedUrlQuery = (
  tbd: ParsedUrlQuery,
): tbd is LoginPageParsedUrlQuery =>
  typeof tbd.email === "string" &&
  typeof tbd.userId === "string" &&
  typeof tbd.loginCodeId === "string" &&
  typeof tbd.code === "string";

const LoginPage: NextPage = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const parsedQuery = useMemo(() => {
    const { query } = router;

    if (tbdIsLoginPageParsedUrlQuery(query)) {
      return query;
    }
    return undefined;
  }, [router]);

  const [currentPage, setCurrentPage] = useState<"Email" | "VerificationCode">(
    "Email",
  );

  const [loginInfo, setLoginInfo] = useState<LoginInfo | undefined>(
    parsedQuery ?? undefined,
  );

  const [apiLoginErrorMessage, setApiLoginErrorMessage] = useState<ReactNode>();

  useEffect(() => {
    if (parsedQuery) {
      setLoginInfo(parsedQuery);
    }
  }, [parsedQuery]);

  useEffect(() => {
    if (user) {
      void router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const { query } = router;

    if (tbdIsLoginPageParsedUrlQuery(query)) {
      const { redirectAsPath, ...requestBody } = query;

      setCurrentPage("VerificationCode");

      /** @todo: set to verification code screen */

      void apiClient
        .post<ApiLoginWithLoginCodeRequestBody, ApiLoginWithLoginCodeResponse>(
          "loginWithLoginCode",
          requestBody,
        )
        .then(({ data, error }) => {
          if (error) {
            if (error.response?.data.errors) {
              setApiLoginErrorMessage(
                error.response.data.errors.map(({ msg }) => msg),
              );
            } else {
              throw error;
            }
          } else if (data) {
            void router.push(redirectAsPath ?? "/");
          }
        });
    }
  }, [router]);

  const handleLoginCodeSent = (params: {
    userId: string;
    loginCodeId: string;
    email: string;
  }) => {
    setLoginInfo(params);
    setCurrentPage("VerificationCode");
  };

  const handleLogin = (loggedInUser: SerializedUser) => {
    if (!loggedInUser.isSignedUp) {
      /** @todo: redirect to signup page if user hasn't completed signup */
    }
    setUser(loggedInUser);
    void router.push("/");
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
            <Fade in={currentPage !== "Email"}>
              <Box>
                <Button
                  onClick={() => setCurrentPage("Email")}
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
            {currentPage === "Email" ? (
              <SendLoginCodeScreen
                initialEmail={loginInfo?.email || ""}
                onLoginCodeSent={handleLoginCodeSent}
              />
            ) : null}
            {currentPage === "VerificationCode" && loginInfo ? (
              <LoginWithLoginCodeScreen
                loginInfo={loginInfo}
                setLoginCodeId={(loginCodeId) => {
                  setLoginInfo({
                    ...loginInfo,
                    loginCodeId,
                  });
                }}
                initialVerificationCode={parsedQuery?.code}
                initialApiLoginErrorMessage={apiLoginErrorMessage}
                onLogin={handleLogin}
                onChangeEmail={() => setCurrentPage("Email")}
              />
            ) : null}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
