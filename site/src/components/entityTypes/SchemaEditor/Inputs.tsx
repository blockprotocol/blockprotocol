import Checkbox from "@mui/material/Checkbox";
import { ChangeEvent, useEffect, useState, VoidFunctionComponent } from "react";

import { TextField } from "../../TextField";

export const TextInputOrDisplay: VoidFunctionComponent<{
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
    return <span>{value}</span>;
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
      value={draftText}
      variant="outlined"
    />
  );
};

export const ToggleInputOrDisplay: VoidFunctionComponent<{
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
