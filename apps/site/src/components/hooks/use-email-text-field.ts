import { useEffect, useState } from "react";

// Taken from http://emailregex.com/
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type UseEmailTextFieldProps = {
  initialEmail?: string;
  required?: boolean;
};

export const useEmailTextField = ({
  required = true,
  initialEmail = "",
}: UseEmailTextFieldProps) => {
  const [emailValue, setEmailValue] = useState<string>(initialEmail);

  useEffect(() => {
    setEmailValue(initialEmail);
  }, [initialEmail]);

  const isEmpty = !emailValue;

  const isFormatted = EMAIL_REGEX.test(emailValue);

  const isEmailValid = (!required || !isEmpty) && isFormatted;

  const emailHelperText =
    required && isEmpty
      ? "Please enter a email address"
      : !isFormatted
      ? "Please enter a valid email address"
      : undefined;

  return {
    emailValue,
    emailHelperText,
    setEmailValue,
    isEmailValid,
  };
};
