import { Modal, Paper, ModalProps, Box, Icon, Fade } from "@mui/material";
import React, { useContext, useEffect, useState, VFC } from "react";
import { SerializedUser } from "../../lib/model/user.model";
import { Button } from "../Button";
import UserContext from "../../context/UserContext";
import {
  LoginInfo,
  LoginWithLoginCodeScreen,
} from "./LoginWithLoginCodeScreen";
import { SendLoginCodeScreen } from "./SendLoginCodeScreen";

type LoginModalProps = {
  onClose: () => void;
} & Omit<ModalProps, "children" | "onClose">;

type LoginModalPage = "Email" | "VerificationCode";

export const LoginModal: VFC<LoginModalProps> = ({
  onClose,
  ...modalProps
}) => {
  const { user, setUser } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState<LoginModalPage>("Email");

  const [loginInfo, setLoginInfo] = useState<LoginInfo>();

  const reset = () => {
    setCurrentPage("Email");
    setLoginInfo(undefined);
  };

  useEffect(() => {
    if (modalProps.open && user) {
      reset();
      onClose();
    }
  }, [modalProps.open, user, onClose]);

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
                  onLogin={handleLogin}
                  onChangeEmail={() => setCurrentPage("Email")}
                />
              ) : null}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
};
