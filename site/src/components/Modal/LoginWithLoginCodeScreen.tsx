import { Typography, Box, Icon } from "@mui/material";
import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  VFC,
  ClipboardEventHandler,
} from "react";
import { apiClient } from "../../lib/apiClient";
import { SerializedUser } from "../../lib/model/user.model";
import {
  ApiLoginWithLoginCodeRequestBody,
  ApiLoginWithLoginCodeResponse,
} from "../../pages/api/loginWithLoginCode.api";
import { Button } from "../Button";
import { TextField } from "../TextField";
import {
  isVerificationCodeFormatted,
  useVerificationCodeTextField,
} from "../hooks/useVerificationCodeTextField";

type LoginWithLoginCodeScreenProps = {
  userId: string;
  loginCodeId: string;
  email: string;
  initialVerificationCode?: string;
  initialApiLoginErrorMessage?: ReactNode;
  setLoginCodeId: (loginCodeId: string) => void;
  onLogin: (user: SerializedUser) => void;
  onChangeEmail: () => void;
};

const parseVerificationCodeInput = (inputCode: string) =>
  inputCode.replace(/\s/g, "");

export const LoginWithLoginCodeScreen: VFC<LoginWithLoginCodeScreenProps> = ({
  userId,
  loginCodeId,
  email,
  initialVerificationCode,
  initialApiLoginErrorMessage,
  setLoginCodeId,
  onLogin,
  onChangeEmail,
}) => {
  const loginCodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loginCodeInputRef.current) {
      loginCodeInputRef.current.select();
    }
  }, [loginCodeInputRef]);

  const [touchedVerificationCodeInput, setTouchedVerificationCodeInput] =
    useState<boolean>(false);

  const [sendingLoginCode, setSendingLoginCode] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const [apiResendEmailErrorMessage, setApiResendEmailErrorMessage] =
    useState<ReactNode>();
  const [apiLoginErrorMessage, setApiLoginErrorMessage] = useState<ReactNode>(
    initialApiLoginErrorMessage,
  );

  const {
    verificationCode,
    setVerificationCode,
    isVerificationCodeValid: isVerificationCodeInputValid,
    verificationCodeHelperText,
  } = useVerificationCodeTextField({ initialVerificationCode });

  useEffect(() => {
    if (initialApiLoginErrorMessage) {
      setApiLoginErrorMessage(initialApiLoginErrorMessage);
    }
  }, [initialApiLoginErrorMessage]);

  useEffect(() => {
    if (initialVerificationCode) {
      setTouchedVerificationCodeInput(true);
      setVerificationCode(initialVerificationCode);
    }
  }, [initialVerificationCode, setVerificationCode]);

  const handleResendEmail = async () => {
    setSendingLoginCode(true);
    setApiResendEmailErrorMessage(undefined);

    const { data, error } = await apiClient.sendLoginCode({ email });
    setSendingLoginCode(false);

    if (error) {
      if (error.response?.data.errors) {
        setApiResendEmailErrorMessage(
          error.response.data.errors.map(({ msg }) => msg),
        );
      } else {
        throw error;
      }
    } else if (data) {
      setVerificationCode("");
      setApiLoginErrorMessage(undefined);
      setTouchedVerificationCodeInput(false);
      setLoginCodeId(data.loginCodeId);
      if (loginCodeInputRef.current) {
        loginCodeInputRef.current.select();
      }
    }
  };

  const handleSubmit = async (code: string) => {
    setTouchedVerificationCodeInput(true);
    setApiLoginErrorMessage(undefined);

    if (isVerificationCodeFormatted(code)) {
      setLoggingIn(true);
      const { data, error } = await apiClient.post<
        ApiLoginWithLoginCodeRequestBody,
        ApiLoginWithLoginCodeResponse
      >("loginWithLoginCode", { userId, loginCodeId, code });
      setLoggingIn(false);

      if (error) {
        if (error.response?.data.errors) {
          setApiLoginErrorMessage(
            error.response.data.errors.map(({ msg }) => msg),
          );
        } else {
          throw error;
        }
      } else if (data) {
        onLogin(data.user);
      }
    }
  };

  const handleVerificationCodeInputPaste: ClipboardEventHandler<
    HTMLInputElement
  > = ({ currentTarget }) => {
    const originalValue = currentTarget.value;

    setTimeout(() => {
      const valueAfterPasting = currentTarget?.value;

      if (!valueAfterPasting || originalValue === valueAfterPasting) {
        return;
      }

      const pastedCode = parseVerificationCodeInput(valueAfterPasting);
      if (isVerificationCodeFormatted(pastedCode)) {
        void handleSubmit(pastedCode);
      }
    }, 500);
  };

  const helperText = touchedVerificationCodeInput
    ? apiResendEmailErrorMessage ??
      apiLoginErrorMessage ??
      verificationCodeHelperText
    : undefined;

  const isVerificationCodeInvalid =
    !!apiResendEmailErrorMessage ||
    !!apiLoginErrorMessage ||
    !isVerificationCodeInputValid;

  const displayError =
    touchedVerificationCodeInput && isVerificationCodeInvalid;

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Icon
        className="fa-solid fa-envelope-dot"
        sx={{
          fontSize: 50,
          color: ({ palette }) => palette.purple[600],
          marginBottom: 3,
        }}
      />
      <Typography
        variant="bpHeading3"
        textAlign="center"
        marginBottom={2}
        sx={{
          color: ({ palette }) => palette.gray[80],
          fontWeight: 500,
        }}
      >
        Check your inbox
      </Typography>
      <Typography
        variant="bpBodyCopy"
        textAlign="center"
        marginBottom={1}
        sx={{
          maxWidth: {
            xs: "unset",
            sm: "70%",
          },
        }}
      >
        We’ve sent an email with a verification code to <strong>{email}</strong>
        .
      </Typography>
      <Typography
        variant="bpBodyCopy"
        textAlign="center"
        marginBottom={3}
        sx={{
          maxWidth: {
            xs: "unset",
            sm: "70%",
          },
        }}
      >
        Enter the code below, or click the link in your email to sign in.
      </Typography>
      <Box
        width="100%"
        component="form"
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          void handleSubmit(verificationCode);
        }}
        marginBottom={3}
      >
        <TextField
          fullWidth
          label="Verification Code"
          placeholder="your-verification-code"
          variant="outlined"
          error={displayError}
          value={verificationCode}
          helperText={helperText}
          onBlur={() => setTouchedVerificationCodeInput(true)}
          onChange={({ target }) => {
            if (apiLoginErrorMessage) setApiLoginErrorMessage(undefined);
            setVerificationCode(target.value);
          }}
          inputProps={{
            onPaste: handleVerificationCodeInputPaste,
          }}
          inputRef={loginCodeInputRef}
        />
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Button
            variant="secondary"
            fullWidth
            squared
            onClick={handleResendEmail}
            loading={sendingLoginCode}
            sx={{
              marginRight: {
                xs: 0,
                sm: 1,
              },
              marginBottom: {
                xs: 2,
                sm: 0,
              },
            }}
          >
            Resend Email
          </Button>
          <Button
            fullWidth
            squared
            disabled={displayError}
            loading={loggingIn}
            type="submit"
            sx={{
              marginLeft: {
                xs: 0,
                sm: 1,
              },
            }}
          >
            Log In
          </Button>
        </Box>
      </Box>
      <Typography
        variant="bpSmallCopy"
        textAlign="center"
        sx={{
          color: ({ palette }) => palette.gray[70],
          maxWidth: {
            xs: "unset",
            sm: "70%",
          },
        }}
      >
        It may take a few minutes to arrive. Make sure you check your spam
        folder.
      </Typography>
      <Typography
        variant="bpSmallCopy"
        sx={{
          color: ({ palette }) => palette.gray[60],
          maxWidth: {
            xs: "unset",
            sm: "70%",
          },
        }}
      >
        Or{" "}
        <a role="button" aria-hidden="true" onClick={onChangeEmail}>
          Use a different email address
        </a>
      </Typography>
    </Box>
  );
};
