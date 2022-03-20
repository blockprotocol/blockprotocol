import { Typography, Box } from "@mui/material";
import React, { ReactNode, useEffect, useRef, useState, VFC } from "react";
import { apiClient } from "../../lib/apiClient";
import { Button } from "../Button";
import { TextField } from "../TextField";
import { Link } from "../Link";
import { BlockProtocolIcon } from "../icons";
import { useEmailTextField } from "../hooks/useEmailTextField";
import { VerificationCodeInfo } from "./VerificationCodeScreen";

type SignupScreenProps = {
  initialEmail?: string;
  onSignup: (params: {
    verificationCodeInfo: VerificationCodeInfo;
    email: string;
  }) => void;
  onClose?: () => void;
};

export const SignupScreen: VFC<SignupScreenProps> = ({
  initialEmail,
  onSignup,
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
  const [signingUp, setSigningUp] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<ReactNode>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrorMessage(undefined);
    setTouchedEmailInput(true);

    if (isEmailInputValid) {
      setSigningUp(true);
      const { data: verificationCodeInfo, error } = await apiClient.signup({
        email: emailValue,
      });
      setSigningUp(false);

      if (error) {
        setApiErrorMessage(error.message);
      } else if (verificationCodeInfo) {
        onSignup({ verificationCodeInfo, email: emailValue });
      }
    }
  };

  const reset = () => {
    setEmailValue("");
    setTouchedEmailInput(false);
    setSigningUp(false);
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
        Create your Block Protocol account
      </Typography>
      <Box width="100%" component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          sx={{ marginBottom: 2 }}
          required
          type="email"
          onBlur={() => setTouchedEmailInput(true)}
          error={displayError}
          helperText={helperText}
          inputRef={emailInputRef}
          fullWidth
          label="Email address"
          placeholder="claude@shannon.com"
          variant="outlined"
          value={emailValue}
          onChange={({ target }) => {
            if (apiErrorMessage) setApiErrorMessage(undefined);
            setEmailValue(target.value);
          }}
        />
        <Button
          loading={signingUp}
          disabled={displayError}
          fullWidth
          squared
          type="submit"
          sx={{ marginBottom: 3 }}
        >
          Continue
        </Button>
      </Box>
      <Typography textAlign="center">
        Have an account?{" "}
        <Link
          href={{
            pathname: "/login",
            query: emailValue ? { email: emailValue } : undefined,
          }}
          onClick={handleClose}
        >
          Log in
        </Link>
      </Typography>
    </>
  );
};
