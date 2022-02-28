import { Typography, Box, Icon } from "@mui/material";
import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  VFC,
  ClipboardEventHandler,
  useCallback,
} from "react";
import { unstable_batchedUpdates } from "react-dom";
import { ApiClientError } from "../../lib/apiClient";
import { SerializedUser } from "../../lib/api/model/user.model";
import { Button } from "../Button";
import { TextField } from "../TextField";
import {
  isVerificationCodeFormatted,
  useVerificationCodeTextField,
} from "../hooks/useVerificationCodeTextField";

export type VerificationCodeInfo = {
  userId: string;
  verificationCodeId: string;
};

type VerificationCodeScreenProps = {
  verificationCodeInfo: VerificationCodeInfo;
  email: string;
  initialVerificationCode?: string;
  setVerificationCodeId: (verificationCodeId: string) => void;
  onSubmit: (user: SerializedUser) => void;
  onChangeEmail: () => void;
  resend: (params: { email: string }) => Promise<{
    data?: { userId: string; verificationCodeId: string };
    error?: ApiClientError;
  }>;
  submit: (params: {
    userId: string;
    verificationCodeId: string;
    code: string;
  }) => Promise<{
    data?: { user: SerializedUser };
    error?: ApiClientError;
  }>;
};

const parseVerificationCodeInput = (inputCode: string) =>
  inputCode.replace(/\s/g, "");

export const VerificationCodeScreen: VFC<VerificationCodeScreenProps> = ({
  verificationCodeInfo,
  email,
  initialVerificationCode,
  setVerificationCodeId,
  onSubmit,
  onChangeEmail,
  resend,
  submit,
}) => {
  const verificationCodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (verificationCodeInputRef.current) {
      verificationCodeInputRef.current.select();
    }
  }, [verificationCodeInputRef]);

  const [touchedVerificationCodeInput, setTouchedVerificationCodeInput] =
    useState<boolean>(false);

  const [sendingVerificationCode, setSendingVerificationCode] =
    useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [apiResendEmailErrorMessage, setApiResendEmailErrorMessage] =
    useState<ReactNode>();
  const [apiSubmittedErrorMessage, setApiSubmittedErrorMessage] =
    useState<ReactNode>();

  const {
    verificationCode,
    setVerificationCode,
    isVerificationCodeValid: isVerificationCodeInputValid,
    verificationCodeHelperText,
  } = useVerificationCodeTextField({ initialVerificationCode });

  const { userId, verificationCodeId } = verificationCodeInfo;

  const handleResendEmail = async () => {
    setSendingVerificationCode(true);
    setApiResendEmailErrorMessage(undefined);

    const { data, error } = await resend({ email });
    setSendingVerificationCode(false);

    if (error) {
      setApiResendEmailErrorMessage(error.message);
    } else if (data) {
      unstable_batchedUpdates(() => {
        setVerificationCode("");
        setApiSubmittedErrorMessage(undefined);
        setTouchedVerificationCodeInput(false);
        setVerificationCodeId(data.verificationCodeId);
      });
      if (verificationCodeInputRef.current) {
        verificationCodeInputRef.current.select();
      }
    }
  };

  const handleSubmit = useCallback(
    async (code: string) => {
      setTouchedVerificationCodeInput(true);
      setApiSubmittedErrorMessage(undefined);

      if (isVerificationCodeFormatted(code)) {
        setSubmitting(true);
        const { data, error } = await submit({
          userId,
          verificationCodeId,
          code,
        });
        setSubmitting(false);

        if (error) {
          setApiSubmittedErrorMessage(error.message);
        } else if (data) {
          onSubmit(data.user);
        }
      }
    },
    [onSubmit, submit, userId, verificationCodeId],
  );

  useEffect(() => {
    if (initialVerificationCode) {
      setTouchedVerificationCodeInput(true);
      setVerificationCode(initialVerificationCode);
      void handleSubmit(initialVerificationCode);
    }
  }, [initialVerificationCode, setVerificationCode, handleSubmit]);

  const handleVerificationCodeInputPaste: ClipboardEventHandler<
    HTMLInputElement
  > = ({ currentTarget }) => {
    const originalValue = currentTarget.value;

    setTimeout(() => {
      const valueAfterPasting = currentTarget?.value;

      if (!valueAfterPasting || originalValue === valueAfterPasting) {
        return;
      }

      const pastedCode = parseVerificationCodeInput(valueAfterPasting);
      if (isVerificationCodeFormatted(pastedCode)) {
        void handleSubmit(pastedCode);
      }
    }, 500);
  };

  const helperText = touchedVerificationCodeInput
    ? apiResendEmailErrorMessage ??
      apiSubmittedErrorMessage ??
      verificationCodeHelperText
    : undefined;

  const isVerificationCodeValid =
    !(apiResendEmailErrorMessage || apiSubmittedErrorMessage) &&
    isVerificationCodeInputValid;

  const displayError = touchedVerificationCodeInput && !isVerificationCodeValid;

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Icon
        className="fa-solid fa-envelope-dot"
        sx={{
          fontSize: 50,
          color: ({ palette }) => palette.purple[600],
          marginBottom: 3,
        }}
      />
      <Typography
        variant="bpHeading3"
        textAlign="center"
        marginBottom={2}
        sx={{
          color: ({ palette }) => palette.gray[90],
          fontWeight: 500,
        }}
      >
        Check your inbox
      </Typography>
      <Typography
        variant="bpBodyCopy"
        textAlign="center"
        marginBottom={1}
        sx={{
          maxWidth: {
            xs: "unset",
            sm: "70%",
          },
        }}
      >
        We’ve sent an email with a verification code to <strong>{email}</strong>
        .
      </Typography>
      <Typography
        variant="bpBodyCopy"
        textAlign="center"
        marginBottom={3}
        sx={{
          maxWidth: {
            xs: "unset",
            sm: "70%",
          },
        }}
      >
        Enter the code below, or click the link in your email to sign in.
      </Typography>
      <Box
        width="100%"
        component="form"
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          void handleSubmit(verificationCode);
        }}
        marginBottom={3}
      >
        <TextField
          sx={{ marginBottom: 2 }}
          fullWidth
          label="Verification Code"
          placeholder="your-verification-code"
          variant="outlined"
          error={displayError}
          value={verificationCode}
          helperText={helperText}
          onBlur={() => setTouchedVerificationCodeInput(true)}
          onChange={({ target }) => {
            if (apiSubmittedErrorMessage) {
              setApiSubmittedErrorMessage(undefined);
            }
            setVerificationCode(target.value);
          }}
          inputProps={{
            onPaste: handleVerificationCodeInputPaste,
          }}
          inputRef={verificationCodeInputRef}
        />
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Button
            variant="secondary"
            fullWidth
            squared
            onClick={handleResendEmail}
            loading={sendingVerificationCode}
            sx={{
              marginRight: {
                xs: 0,
                sm: 1,
              },
              marginBottom: {
                xs: 2,
                sm: 0,
              },
            }}
          >
            Resend Email
          </Button>
          <Button
            fullWidth
            squared
            disabled={displayError}
            loading={submitting}
            type="submit"
            sx={{
              marginLeft: {
                xs: 0,
                sm: 1,
              },
            }}
          >
            Log In
          </Button>
        </Box>
      </Box>
      <Typography
        variant="bpSmallCopy"
        textAlign="center"
        sx={{
          color: ({ palette }) => palette.gray[80],
          maxWidth: {
            xs: "unset",
            sm: "70%",
          },
        }}
      >
        It may take a few minutes to arrive. Make sure you check your spam
        folder.
      </Typography>
      <Typography
        variant="bpSmallCopy"
        sx={{
          color: ({ palette }) => palette.gray[70],
          maxWidth: {
            xs: "unset",
            sm: "70%",
          },
        }}
      >
        Or{" "}
        <a role="button" aria-hidden="true" onClick={onChangeEmail}>
          Use a different email address
        </a>
      </Typography>
    </Box>
  );
};
