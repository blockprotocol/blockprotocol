import { ReactNode, useEffect, useState, VFC } from "react";
import {
  Box,
  Collapse,
  // eslint-disable-next-line no-restricted-imports
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  Icon,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";

type TextFieldProps = {
  displayErrorOnTouched?: boolean;
} & MuiTextFieldProps;

export const TextField: VFC<TextFieldProps> = ({
  helperText,
  sx,
  ...textFieldProps
}) => {
  const [recentHelperText, setRecentHelperText] = useState<
    ReactNode | undefined
  >(helperText);

  useEffect(() => {
    if (helperText) {
      setRecentHelperText(helperText);
    }
  }, [helperText]);

  return (
    <Box sx={sx}>
      {/** @todo: instead of using the wrapper MuiTextField component use the underlying Mui components:
       *     - [FormControl](https://mui.com/api/form-control/)
       *     - [InputLabel](https://mui.com/api/input-label/)
       *     - [FilledInput](https://mui.com/api/filled-input/)
       *     - [OutlinedInput](https://mui.com/api/outlined-input/)
       *     - [Input](https://mui.com/api/input/)
       *     - [FormHelperText](https://mui.com/api/form-helper-text/)
       */}
      <MuiTextField
        {...textFieldProps}
        InputProps={{
          ...textFieldProps.InputProps,
          /** @todo: figure out why this is required and the theme defaultProps cannot be relied on */
          ...{ notched: false },
          endAdornment: textFieldProps.error ? (
            <Box>
              <Icon
                sx={{ fontSize: 22, color: "currentColor" }}
                className="fa-solid fa-circle-exclamation"
              />
            </Box>
          ) : (
            textFieldProps.InputProps?.endAdornment
          ),
        }}
      />
      <Collapse
        in={!!helperText}
        onExited={() => setRecentHelperText(undefined)}
      >
        <FormHelperText
          error={textFieldProps.error}
          sx={{ marginTop: 1, fontSize: 15 }}
        >
          {recentHelperText}
        </FormHelperText>
      </Collapse>
    </Box>
  );
};
