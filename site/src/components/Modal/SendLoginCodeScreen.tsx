import { Typography, Box } from "@mui/material";
import React, { ReactNode, useEffect, useRef, useState, VFC } from "react";
import { apiClient } from "../../lib/apiClient";
import { ApiSendLoginCodeResponse } from "../../pages/api/sendLoginCode.api";
import { Button } from "../Button";
import { TextField } from "../TextField";
import { Link } from "../Link";
import { BlockProtocolIcon } from "../SvgIcon/BlockProtocolIcon";
import { useEmailTextField } from "../hooks/useEmailTextField";

type SendLoginCodeScreenProps = {
  initialEmail: string;
  onLoginCodeSent: (
    params: ApiSendLoginCodeResponse & { email: string },
  ) => void;
};

export const SendLoginCodeScreen: VFC<SendLoginCodeScreenProps> = ({
  initialEmail,
  onLoginCodeSent,
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
      const { data, error } = await apiClient.sendLoginCode({
        email: emailValue,
      });
      setSendingLoginCode(false);

      if (error) {
        if (error.response?.data.errors) {
          setApiErrorMessage(error.response.data.errors.map(({ msg }) => msg));
        } else {
          throw error;
        }
      } else if (data) {
        const { userId, loginCodeId } = data;
        onLoginCodeSent({ userId, loginCodeId, email: emailValue });
      }
    }
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
          color: ({ palette }) => palette.gray[80],
        }}
      >
        Sign in to the
        <br />
        <strong>Block Protocol</strong>
      </Typography>
      <Box width="100%" component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          required
          type="email"
          onBlur={() => setTouchedEmailInput(true)}
          error={displayError}
          helperText={helperText}
          inputRef={emailInputRef}
          fullWidth
          label="Email address"
          placeholder="you@example.com"
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
        Not signed up yet? <Link href="/signup">Create an account</Link>
      </Typography>
    </>
  );
};
