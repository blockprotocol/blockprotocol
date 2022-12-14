// Our custom TextField hides the 'endAdornment' when the 'error' prop is true
// eslint-disable-next-line no-restricted-imports
import TextField from "@mui/material/TextField";
import { MouseEvent, useRef, useState } from "react";

import { Button } from "../../button";
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
      // ADD TO MAILCHIMP EMAIL LIST
    }
  };

  return (
    <TextField
      sx={{ marginBottom: 2, maxWidth: 480 }}
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
              fontSize: 15,
              paddingLeft: 3,
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
                  color: ({ palette }) => `${palette.common.white} !important`,
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
          fontSize: 15,
          borderRadius: 34,
          pr: 0,
        },
      }}
    />
  );
};
