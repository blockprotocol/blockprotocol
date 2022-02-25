import { Box, Collapse, FormHelperText, Icon, Typography } from "@mui/material";
import { ReactNode, useRef, useState, VFC } from "react";
import { TextField } from "../TextField";
import { Button } from "../Button";
import { useShortnameTextField } from "../hooks/useShortnameTextField";
import { apiClient } from "../../lib/apiClient";
import {
  ApiCompleteSignupRequestBody,
  ApiCompleteSignupResponse,
} from "../../pages/api/completeSignup.api";
import { useUser } from "../../context/UserContext";

type CompleteSignupScreenProps = {
  email: string;
};

export const CompleteSignupScreen: VFC<CompleteSignupScreenProps> = ({
  email,
}) => {
  const { setUser } = useUser();

  const shortnameInputRef = useRef<HTMLInputElement>(null);
  const preferredNameInputRef = useRef<HTMLInputElement>(null);

  const [touchedPreferredNameInput, setTouchedPreferredNameInput] =
    useState<boolean>(false);
  const [touchedShortnameInput, setTouchedShortnameInput] =
    useState<boolean>(false);

  const [completingSignup, setCompletingSignup] = useState<boolean>(false);
  const [completeSignupError, setCompleteSignupError] = useState<ReactNode>();

  const { shortname, setShortname, isShortnameValid, shortnameHelperText } =
    useShortnameTextField({
      touched: touchedShortnameInput,
    });

  const [preferredName, setPreferredName] = useState<string>("");

  const isPreferredNameEmpty = !preferredName;

  const isPreferredNameValid = !isPreferredNameEmpty;
  const preferredNameHelperText = isPreferredNameEmpty
    ? "You must choose a preferred name"
    : undefined;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isShortnameValid && isPreferredNameValid) {
      setCompletingSignup(true);
      const { data, error } = await apiClient.post<
        ApiCompleteSignupRequestBody,
        ApiCompleteSignupResponse
      >("completeSignup", { shortname, preferredName });
      setCompletingSignup(false);

      if (error) {
        setCompleteSignupError(error.message);
      } else if (data) {
        setUser(data.user);
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Icon
        className="fa-solid fa-badge-check"
        sx={{
          fontSize: 50,
          color: ({ palette }) => palette.purple[600],
          marginBottom: 3,
        }}
      />
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
        Thanks for confirming your email <strong>{email}</strong>
      </Typography>
      <Typography
        variant="bpHeading3"
        textAlign="center"
        marginBottom={2}
        sx={{
          color: ({ palette }) => palette.gray[90],
          fontWeight: 500,
        }}
      >
        Add your account details
      </Typography>
      <Box
        width="100%"
        component="form"
        onSubmit={handleSubmit}
        marginBottom={3}
      >
        <TextField
          sx={{ marginBottom: 2 }}
          fullWidth
          label="Username"
          placeholder="claudeshannon"
          variant="outlined"
          error={
            touchedShortnameInput && !isShortnameValid && !!shortnameHelperText
          }
          value={shortname}
          helperText={touchedShortnameInput ? shortnameHelperText : undefined}
          onBlur={() => setTouchedShortnameInput(true)}
          onChange={({ target }) => {
            setShortname(target.value);
          }}
          inputRef={shortnameInputRef}
        />
        <TextField
          sx={{ marginBottom: 2 }}
          fullWidth
          label="First or preferred name"
          placeholder="Claude"
          variant="outlined"
          error={
            touchedPreferredNameInput &&
            !isPreferredNameValid &&
            !!preferredNameHelperText
          }
          value={preferredName}
          helperText={preferredNameHelperText}
          onBlur={() => setTouchedPreferredNameInput(true)}
          onChange={({ target }) => {
            setPreferredName(target.value.trim());
          }}
          inputRef={preferredNameInputRef}
        />
        <Button
          fullWidth
          squared
          disabled={!isShortnameValid}
          loading={completingSignup}
          type="submit"
        >
          Continue
        </Button>
        <Collapse in={!!completeSignupError}>
          <FormHelperText error sx={{ marginTop: 1, fontSize: 15 }}>
            {completeSignupError}
          </FormHelperText>
        </Collapse>
      </Box>
    </Box>
  );
};
