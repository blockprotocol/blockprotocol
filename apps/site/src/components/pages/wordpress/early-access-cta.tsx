import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Box, inputBaseClasses, Theme, useMediaQuery } from "@mui/material";
// Our custom TextField hides the 'endAdornment' when the 'error' prop is true
// eslint-disable-next-line no-restricted-imports
import TextField from "@mui/material/TextField";
import { FormEvent, useMemo, useRef, useState } from "react";

import { apiClient } from "../../../lib/api-client";
import { Button } from "../../button";
import { useEmailTextField } from "../../hooks/use-email-text-field";
import { ArrowRightIcon, FontAwesomeIcon } from "../../icons";
import { useEmailSubmitted } from "./email-submitted-context";

const submittedEmailText = "You’re on the waitlist as";
const submitErrorText = "There was an error submitting your email";

export const EarlyAccessCTA = () => {
  const { submittedEmail, setSubmittedEmail } = useEmailSubmitted();

  const emailInputRef = useRef<HTMLInputElement>(null);

  const isSmall = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.down("md"),
  );

  const {
    emailValue,
    setEmailValue,
    isEmailValid: isEmailInputValid,
    emailHelperText,
  } = useEmailTextField({});

  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [touchedEmailInput, setTouchedEmailInput] = useState<boolean>(false);

  const helperText = touchedEmailInput ? emailHelperText : undefined;

  const isEmailInvalid = !isEmailInputValid;

  const displayError = touchedEmailInput && isEmailInvalid;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (displayError || loading || !!submittedEmail) {
      return;
    }

    setTouchedEmailInput(true);

    if (isEmailInputValid) {
      setLoading(true);
      await apiClient.subscribeEmailWP(emailValue).then(({ data }) => {
        setSubmitError(false);
        setLoading(false);

        if (data?.success) {
          setSubmittedEmail(emailValue);
        } else {
          setSubmitError(true);
        }
      });
    }
  };

  const textFieldHelperText = useMemo(() => {
    if (submittedEmail) {
      return `${submittedEmailText} ${submittedEmail}`;
    } else if (submitError) {
      return submitErrorText;
    }

    return helperText;
  }, [submittedEmail, submitError, helperText]);

  return (
    <Box component="form" onSubmit={handleSubmit} width={1}>
      <TextField
        disabled={loading || !!submittedEmail}
        sx={{
          marginBottom: 2,
          maxWidth: 500,
        }}
        required
        type="email"
        error={displayError || submitError}
        helperText={textFieldHelperText}
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
              disabled={displayError || loading || !!submittedEmail}
              type="submit"
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
                ...(submittedEmail
                  ? {
                      background: ({ palette }) =>
                        `${palette.green[80]} !important`,
                    }
                  : {}),
                [breakpoints.down("sm")]: {
                  px: 2.5,
                },
                "&.Mui-disabled": {
                  borderColor: "#DDE7F0 !important",
                },
              })}
              endIcon={
                submittedEmail ? (
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
              loading={loading}
            >
              {submittedEmail ? "Submitted" : "Get early access"}
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
            [`&.${inputBaseClasses.disabled} .MuiOutlinedInput-notchedOutline`]:
              {
                borderColor: "#DDE7F0 !important",
              },
          },
        }}
      />
    </Box>
  );
};
