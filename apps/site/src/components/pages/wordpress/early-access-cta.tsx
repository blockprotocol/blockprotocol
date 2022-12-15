import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { inputBaseClasses, Theme, useMediaQuery } from "@mui/material";
// Our custom TextField hides the 'endAdornment' when the 'error' prop is true
// eslint-disable-next-line no-restricted-imports
import TextField from "@mui/material/TextField";
import { MouseEvent, TouchEvent, useRef, useState } from "react";

import { apiClient } from "../../../lib/api-client";
import { Button } from "../../button";
import { useEmailTextField } from "../../hooks/use-email-text-field";
import { ArrowRightIcon, FontAwesomeIcon } from "../../icons";

const submitErrorText = "There was an error submitting your email";

export const EarlyAccessCTA = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);

  const isSmall = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.down("sm"),
  );

  const {
    emailValue,
    setEmailValue,
    isEmailValid: isEmailInputValid,
    emailHelperText,
  } = useEmailTextField({});

  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [touchedEmailInput, setTouchedEmailInput] = useState<boolean>(false);

  const helperText = touchedEmailInput ? emailHelperText : undefined;

  const isEmailInvalid = !isEmailInputValid;

  const displayError = touchedEmailInput && isEmailInvalid;

  const handleSubmit = async (
    event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setTouchedEmailInput(true);

    if (isEmailInputValid) {
      setLoading(true);
      await apiClient.subscribeEmailWP(emailValue).then(({ data }) => {
        setSubmitError(false);
        setLoading(false);

        if (data?.success) {
          setSubmitted(true);
        } else {
          setSubmitError(true);
        }
      });
    }
  };

  return (
    <TextField
      disabled={loading || submitted}
      sx={{ marginBottom: 2, maxWidth: 480 }}
      required
      type="email"
      error={displayError || submitError}
      helperText={submitError ? submitErrorText : helperText}
      inputRef={emailInputRef}
      fullWidth
      placeholder={isSmall ? "Your email..." : "Enter your email address..."}
      variant="outlined"
      value={emailValue}
      onChange={({ target }) => {
        setSubmitError(false);
        setEmailValue(target.value);
      }}
      InputProps={{
        endAdornment: (
          <Button
            disabled={displayError || loading || submitted}
            sx={({ breakpoints }) => ({
              zIndex: 1,
              whiteSpace: "nowrap",
              minWidth: "unset",
              height: 1,
              fontSize: 15,
              ...(displayError
                ? {
                    background: ({ palette }) =>
                      `${palette.red[600]} !important`,
                  }
                : {}),
              ...(submitted
                ? {
                    background: ({ palette }) =>
                      `${palette.green[80]} !important`,
                  }
                : {}),
              [breakpoints.down("sm")]: {
                px: 2.5,
              },
            })}
            endIcon={
              submitted ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <ArrowRightIcon
                  sx={{
                    color: ({ palette }) =>
                      `${palette.common.white} !important`,
                  }}
                />
              )
            }
            onClick={handleSubmit}
            onTouchStart={handleSubmit}
            loading={loading}
          >
            {submitted ? "Submitted" : "Get early access"}
          </Button>
        ),
        sx: {
          borderRadius: 34,
          pr: 0,
          [`.${inputBaseClasses.input}`]: {
            boxSizing: "border-box",
            height: 46,
            fontSize: 15,
            lineHeight: 1.5,
            pl: 3,
          },
        },
      }}
    />
  );
};
