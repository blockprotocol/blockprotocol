import { faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  CircularProgress,
  outlinedInputClasses,
  TextFieldProps,
  useTheme,
} from "@mui/material";
import { AnimatePresence, m } from "framer-motion";
import { FocusEvent, useState } from "react";

import { FontAwesomeIcon } from "./icons";
import { TextField } from "./text-field";

type SaveOnBlurTextFieldProps = Omit<TextFieldProps, "onBlur"> & {
  onSave: (value: string) => Promise<void>;
};

const outlineSelector = `.${outlinedInputClasses.notchedOutline}`;

export const SaveOnBlurTextField = ({
  onSave,
  onChange,
  value,
  ...rest
}: SaveOnBlurTextFieldProps) => {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [savedAtLeastOnce, setSavedAtLeastOnce] = useState(false);
  const [lastSavedVal, setLastSavedVal] = useState(value);

  const handleBlur = async (event: FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const notChanged = newValue === lastSavedVal;

    if (notChanged) {
      return;
    }

    try {
      setIsLoading(true);

      await onSave(newValue);
      setSavedAtLeastOnce(true);

      setLastSavedVal(newValue);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TextField
      onBlur={handleBlur}
      onChange={isLoading ? undefined : onChange}
      value={value}
      sx={[
        {
          [outlineSelector]: {
            transition: theme.transitions.create(["border-color"]),
          },
        },
        isLoading && {
          [outlineSelector]: {
            borderColor: `${theme.palette.purple[70]} !important`,
            borderWidth: "2px",
          },
        },
      ]}
      {...rest}
      InputProps={{
        endAdornment: savedAtLeastOnce ? (
          <Box>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <m.div
                  key="loading"
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CircularProgress size={16} />
                </m.div>
              ) : (
                <m.div
                  key="check"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    sx={{
                      fontSize: 16,
                      color: theme.palette.purple[70],
                    }}
                  />
                </m.div>
              )}
            </AnimatePresence>
          </Box>
        ) : undefined,
      }}
    />
  );
};
