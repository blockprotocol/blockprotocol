import { useState } from "react";

type UseVerificationCodeTextFieldProps = {
  required?: boolean;
  initialVerificationCode?: string;
};

export const isVerificationCodeFormatted = (verificationCode: string) => {
  const units = verificationCode.split("-");
  return units.length >= 4 && units?.[3]!.length > 0;
};

export const useVerificationCodeTextField = ({
  required = true,
  initialVerificationCode = "",
}: UseVerificationCodeTextFieldProps) => {
  const [verificationCode, setVerificationCode] = useState<string>(
    initialVerificationCode,
  );

  const isEmpty = !verificationCode;

  const isFormatted = isVerificationCodeFormatted(verificationCode);

  const isVerificationCodeValid = (!required || !isEmpty) && isFormatted;

  const verificationCodeHelperText =
    required && isEmpty
      ? "Please enter the verification code"
      : !isFormatted
      ? "Please enter a valid verification code"
      : undefined;

  return {
    verificationCode,
    setVerificationCode,
    isVerificationCodeValid,
    verificationCodeHelperText,
  };
};
