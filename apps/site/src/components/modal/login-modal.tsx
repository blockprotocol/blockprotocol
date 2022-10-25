import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Box, Fade, Modal, ModalProps, Paper } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";

import { useUser } from "../../context/user-context.js";
import { SerializedUser } from "../../lib/api/model/user.model.js";
import { apiClient } from "../../lib/api-client.js";
import { Button } from "../button.jsx";
import { FontAwesomeIcon } from "../icons/index.js";
import { SendLoginCodeScreen } from "../screens/send-login-code-screen.jsx";
import {
  VerificationCodeInfo,
  VerificationCodeScreen,
} from "../screens/verification-code-screen.jsx";

type LoginModalProps = {
  onClose: () => void;
} & Omit<ModalProps, "children" | "onClose">;

type LoginModalPage = "Email" | "VerificationCode";

export const LoginModal: FunctionComponent<LoginModalProps> = ({
  onClose,
  ...modalProps
}) => {
  const { user, setUser } = useUser();
  const [currentPage, setCurrentPage] = useState<LoginModalPage>("Email");

  const [email, setEmail] = useState<string>();
  const [verificationCodeInfo, setVerificationCodeInfo] =
    useState<VerificationCodeInfo>();

  const reset = () => {
    setCurrentPage("Email");
    setVerificationCodeInfo(undefined);
  };

  useEffect(() => {
    if (modalProps.open && user) {
      reset();
      onClose();
    }
  }, [modalProps.open, user, onClose]);

  const handleLoginCodeSent = (params: {
    verificationCodeInfo: VerificationCodeInfo;
    email: string;
  }) => {
    setVerificationCodeInfo(params.verificationCodeInfo);
    setEmail(params.email);
    setCurrentPage("VerificationCode");
  };

  const handleLogin = (loggedInUser: SerializedUser) => {
    if (!loggedInUser.isSignedUp) {
      /** @todo: redirect to signup page if user hasn't completed signup */
    }
    setUser(loggedInUser);
    reset();
    onClose();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      data-testid="login-modal"
      closeAfterTransition
      onClose={handleClose}
      {...modalProps}
    >
      <Fade in={modalProps.open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 600,
            maxHeight: "100%",
            width: "100%",
            overflowY: "auto",
            padding: 1,
          }}
        >
          <Paper
            sx={{
              borderRadius: "6px",
              padding: 2.5,
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
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        sx={{ fontSize: 16 }}
                      />
                    }
                    sx={{
                      fontSize: 15,
                    }}
                  >
                    Back
                  </Button>
                </Box>
              </Fade>
              <Button
                onClick={handleClose}
                variant="transparent"
                endIcon={
                  <FontAwesomeIcon icon={faTimes} sx={{ fontSize: 16 }} />
                }
                sx={{
                  fontSize: 15,
                }}
              >
                Close
              </Button>
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
                  disabled={!modalProps.open}
                  onClose={handleClose}
                />
              ) : null}
              {currentPage === "VerificationCode" &&
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
                  onSubmit={handleLogin}
                  onChangeEmail={() => setCurrentPage("Email")}
                  resend={apiClient.sendLoginCode}
                  submit={apiClient.loginWithLoginCode}
                />
              ) : null}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
};
