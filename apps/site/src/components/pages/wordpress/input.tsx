import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { inputBaseClasses } from "@mui/material";
// eslint-disable-next-line no-restricted-imports -- our custom TextField hides the 'endAdornment' when the 'error' prop is true
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { FunctionComponent, MouseEvent, TouchEvent } from "react";

import { Button } from "../../button";
import { ArrowRightIcon, FontAwesomeIcon } from "../../icons";

export interface InputProps {
  buttonLabel: string;
  loading?: boolean;
  displayError?: boolean;
  success?: boolean;
  handleSubmit: (
    event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>,
  ) => void;
}

export const Input: FunctionComponent<Partial<TextFieldProps> & InputProps> = ({
  placeholder,
  buttonLabel,
  loading,
  displayError,
  success,
  handleSubmit,
  ...props
}) => {
  return (
    <TextField
      {...props}
      sx={{
        marginBottom: 2,
        maxWidth: 480,
      }}
      required
      type="email"
      fullWidth
      placeholder={placeholder}
      variant="outlined"
      InputProps={{
        endAdornment: (
          <Button
            disabled={displayError || loading || success}
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
              ...(success
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
              success ? (
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
            {buttonLabel}
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
          [`&.${inputBaseClasses.disabled} .MuiOutlinedInput-notchedOutline`]: {
            borderColor: "#DDE7F0 !important",
          },
        },
      }}
    />
  );
};
