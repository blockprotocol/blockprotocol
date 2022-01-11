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
import { LoginWithLoginCodeScreen } from "../components/Modal/LoginWithLoginCodeScreen";
import { SendLoginCodeScreen } from "../components/Modal/SendLoginCodeScreen";
import { SerializedUser } from "../lib/model/user.model";
import UserContext from "../components/context/UserContext";

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
  const { user, refetch } = useContext(UserContext);
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
  const [email, setEmail] = useState<string>(parsedQuery?.email || "");

  const [apiLoginErrorMessage, setApiLoginErrorMessage] = useState<ReactNode>();
  const [userId, setUserId] = useState<string>(parsedQuery?.userId || "");
  const [loginCodeId, setLoginCodeId] = useState<string>(
    parsedQuery?.loginCodeId || "",
  );

  useEffect(() => {
    if (parsedQuery) {
      setEmail(parsedQuery.email);
      setUserId(parsedQuery.userId);
      setLoginCodeId(parsedQuery.loginCodeId);
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
    setUserId(params.userId);
    setLoginCodeId(params.loginCodeId);
    setEmail(params.email);
    setCurrentPage("VerificationCode");
  };

  const handleLogin = ({ isSignedUp }: SerializedUser) => {
    if (!isSignedUp) {
      /** @todo: redirect to signup page if user hasn't completed signup */
    }
    refetch();
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
                initialEmail={email}
                onLoginCodeSent={handleLoginCodeSent}
              />
            ) : (
              <LoginWithLoginCodeScreen
                userId={userId!}
                loginCodeId={loginCodeId!}
                email={email}
                setLoginCodeId={setLoginCodeId}
                initialVerificationCode={parsedQuery?.code}
                initialApiLoginErrorMessage={apiLoginErrorMessage}
                onLogin={handleLogin}
                onChangeEmail={() => setCurrentPage("Email")}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
