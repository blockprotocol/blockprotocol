import { Theme, useMediaQuery } from "@mui/material";
import { MouseEvent, TouchEvent, useMemo, useRef, useState } from "react";

import { apiClient } from "../../../lib/api-client";
import { useEmailTextField } from "../../hooks/use-email-text-field";
import { useEmailSubmitted } from "./email-submitted-context";
import { Input } from "./input";

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

  const handleSubmit = async (
    event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setTouchedEmailInput(true);

    if (isEmailInputValid) {
      setLoading(true);
      await apiClient
        .subscribeEmailWP({ email: emailValue })
        .then(({ data }) => {
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
    <Input
      disabled={loading || !!submittedEmail}
      displayError={displayError}
      error={displayError || submitError}
      success={!!submittedEmail}
      helperText={textFieldHelperText}
      inputRef={emailInputRef}
      placeholder={isSmall ? "Your email..." : "Enter your email address..."}
      value={emailValue}
      onChange={({ target }) => {
        setSubmitError(false);
        setEmailValue(target.value);
      }}
      buttonLabel={submittedEmail ? "Submitted" : "Get early access"}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
};
