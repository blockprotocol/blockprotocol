import { Typography, Box } from "@mui/material";
import React, { ReactNode, useEffect, useRef, useState, VFC } from "react";
import { apiClient } from "../../lib/apiClient";
import { Button } from "../Button";
import { TextField } from "../TextField";
import { Link } from "../Link";
import { BlockProtocolIcon } from "../icons";
import { useEmailTextField } from "../hooks/useEmailTextField";
import { VerificationCodeInfo } from "./VerificationCodeScreen";

type SendLoginCodeScreenProps = {
  initialEmail?: string;
  onLoginCodeSent: (params: {
    verificationCodeInfo: VerificationCodeInfo;
    email: string;
  }) => void;
  onClose?: () => void;
};

export const SendLoginCodeScreen: VFC<SendLoginCodeScreenProps> = ({
  initialEmail,
  onLoginCodeSent,
  onClose,
}) => {
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.select();
    }
  }, [emailInputRef]);

  const {
    emailValue,
    setEmailValue,
    isEmailValid: isEmailInputValid,
    emailHelperText,
  } = useEmailTextField({ initialEmail });

  const [touchedEmailInput, setTouchedEmailInput] = useState<boolean>(false);
  const [sendingLoginCode, setSendingLoginCode] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<ReactNode>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrorMessage(undefined);
    setTouchedEmailInput(true);

    if (isEmailInputValid) {
      setSendingLoginCode(true);
      const { data: verificationCodeInfo, error } =
        await apiClient.sendLoginCode({
          email: emailValue,
        });
      setSendingLoginCode(false);

      if (error) {
        setApiErrorMessage(error.message);
      } else if (verificationCodeInfo) {
        onLoginCodeSent({ verificationCodeInfo, email: emailValue });
      }
    }
  };

  const reset = () => {
    setEmailValue("");
    setTouchedEmailInput(false);
    setSendingLoginCode(false);
    setApiErrorMessage(undefined);
  };

  const handleClose = () => {
    reset();
    if (onClose) onClose();
  };

  const helperText = touchedEmailInput
    ? apiErrorMessage ?? emailHelperText
    : undefined;

  const isEmailInvalid = !!apiErrorMessage || !isEmailInputValid;

  const displayError = touchedEmailInput && isEmailInvalid;

  return (
    <>
      <BlockProtocolIcon
        sx={{ color: (theme) => theme.palette.purple[700], marginBottom: 3 }}
      />
      <Typography
        mb={3}
        variant="bpHeading3"
        textAlign="center"
        sx={{
          color: ({ palette }) => palette.gray[90],
        }}
      >
        Sign in to the
        <br />
        <strong>Block Protocol</strong>
      </Typography>
      <Box width="100%" component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          sx={{ marginBottom: 2 }}
          required
          type="email"
          error={displayError}
          helperText={helperText}
          inputRef={emailInputRef}
          fullWidth
          label="Email address"
          placeholder="claude@example.com"
          variant="outlined"
          value={emailValue}
          onChange={({ target }) => {
            if (apiErrorMessage) setApiErrorMessage(undefined);
            setEmailValue(target.value);
          }}
        />
        <Button
          loading={sendingLoginCode}
          disabled={displayError}
          fullWidth
          squared
          type="submit"
          sx={{ marginBottom: 3 }}
        >
          Log In
        </Button>
      </Box>
      <Typography textAlign="center">
        Not signed up yet?{" "}
        <Link
          href={{
            pathname: "/signup",
            query: emailValue ? { email: emailValue } : undefined,
          }}
          onClick={handleClose}
        >
          Create an account
        </Link>
      </Typography>
    </>
  );
};
