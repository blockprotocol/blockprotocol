import { Modal, Paper, ModalProps, Box, Icon, Fade } from "@mui/material";
import React, { useEffect, useState, VFC } from "react";
import { SerializedUser } from "../../lib/api/model/user.model";
import { Button } from "../Button";
import { useUser } from "../../context/UserContext";
import { SendLoginCodeScreen } from "../Screens/SendLoginCodeScreen";
import {
  VerificationCodeInfo,
  VerificationCodeScreen,
} from "../Screens/VerificationCodeScreen";
import { apiClient } from "../../lib/apiClient";
import { useScrollLock } from "../../util/muiUtils";

type LoginModalProps = {
  onClose: () => void;
} & Omit<ModalProps, "children" | "onClose">;

type LoginModalPage = "Email" | "VerificationCode";

export const LoginModal: VFC<LoginModalProps> = ({
  onClose,
  disableScrollLock = false,
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

  useScrollLock(!disableScrollLock && modalProps.open);

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
      closeAfterTransition
      BackdropProps={{
        sx: {
          background: `radial-gradient(${[
            "141.84% 147.92% at 50% 122.49%",
            "rgba(255, 177, 114, 0.75) 0%",
            "rgba(148, 130, 255, 0.75) 32.87%",
            "rgba(132, 230, 255, 0.75) 100%",
          ].join(", ")})`,
        },
      }}
      onClose={handleClose}
      disableScrollLock
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
                      <Icon
                        sx={{ fontSize: 16 }}
                        className="fas fa-arrow-left"
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
                  <Icon sx={{ fontSize: 16 }} className="fas fa-times" />
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
