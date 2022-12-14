import { Button, TextField } from "@mui/material";
import { useRef, useState, MouseEvent } from "react";
import { useEmailTextField } from "../../hooks/use-email-text-field";
import { ArrowRightIcon } from "../../icons";

export const EarlyAccessCTA = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);

  const {
    emailValue,
    setEmailValue,
    isEmailValid: isEmailInputValid,
    emailHelperText,
  } = useEmailTextField({});

  const [touchedEmailInput, setTouchedEmailInput] = useState<boolean>(false);

  const helperText = touchedEmailInput ? emailHelperText : undefined;

  const isEmailInvalid = !isEmailInputValid;

  const displayError = touchedEmailInput && isEmailInvalid;

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setTouchedEmailInput(true);

    if (isEmailInputValid) {
      // setSendingLoginCode(true);
      // const { data: verificationCodeInfo, error } =
      //   await apiClient.sendLoginCode({
      //     email: emailValue,
      //   });
      // setSendingLoginCode(false);
      // if (error) {
      //   setApiErrorMessage(error.message);
      // } else if (verificationCodeInfo) {
      //   onLoginCodeSent({ verificationCodeInfo, email: emailValue });
      // }
    }
  };

  return (
    <>
      <TextField
        sx={{ marginBottom: 2 }}
        required
        type="email"
        error={displayError}
        helperText={helperText}
        inputRef={emailInputRef}
        fullWidth
        placeholder="Enter your email address..."
        variant="outlined"
        value={emailValue}
        onChange={({ target }) => {
          setEmailValue(target.value);
        }}
        InputProps={{
          endAdornment: (
            <Button
              sx={{
                zIndex: 1,
                whiteSpace: "nowrap",
                minWidth: "unset",
                fontSize: "1rem",
                ...(displayError
                  ? {
                      background: ({ palette }) =>
                        `${palette.red[600]} !important`,
                    }
                  : {}),
              }}
              endIcon={
                <ArrowRightIcon
                  sx={{
                    color: ({ palette }) =>
                      `${palette.common.white} !important`,
                  }}
                />
              }
              disabled={displayError}
              onClick={handleSubmit}
            >
              Get early access
            </Button>
          ),
          sx: {
            fontSize: "1rem",
            borderRadius: 34,
            pr: 0,
          },
        }}
      />
    </>
  );
};
