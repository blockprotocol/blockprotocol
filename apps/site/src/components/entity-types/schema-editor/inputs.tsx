import { Checkbox, Typography } from "@mui/material";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";

import { TextField } from "../../text-field.jsx";

export const TextInputOrDisplay: FunctionComponent<{
  clearOnUpdate?: boolean;
  placeholder?: string;
  readonly: boolean;
  required?: boolean;
  updateOnBlur?: boolean;
  updateText: (value: string) => void;
  value: string;
}> = ({
  clearOnUpdate,
  placeholder,
  readonly,
  required,
  updateOnBlur,
  updateText,
  value,
}) => {
  const [draftText, setDraftText] = useState(value);

  useEffect(() => {
    setDraftText(value);
  }, [value]);

  if (readonly) {
    return (
      <Typography
        component="span"
        sx={{
          display: "inline-block",
          overflowWrap: {
            xs: "anywhere",
            md: "unset",
          },
          maxWidth: {
            xs: "125px",
            md: "unset",
          },
          width: {
            xs: "max-content",
            md: "unset",
          },
        }}
      >
        {value}
      </Typography>
    );
  }

  let textChangeEvents: {
    onBlur?: () => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  } = {
    onChange: (evt) => updateText(evt.target.value),
  };

  if (updateOnBlur) {
    textChangeEvents = {
      onBlur: () => {
        updateText(draftText);
        if (clearOnUpdate) {
          setDraftText("");
        }
      },
      onChange: (evt) => setDraftText(evt.target.value),
    };
  }

  return (
    <TextField
      {...textChangeEvents}
      placeholder={placeholder}
      required={required}
      sx={{ minWidth: "125px" }}
      value={draftText}
      variant="outlined"
    />
  );
};

export const ToggleInputOrDisplay: FunctionComponent<{
  checked: boolean;
  onChange: (value: boolean) => void;
  readonly: boolean;
}> = ({ checked, onChange, readonly }) => {
  if (readonly) {
    return <span>{checked ? "Yes" : "No"}</span>;
  }
  return (
    <Checkbox checked={checked} onChange={(_, value) => onChange(value)} />
  );
};
