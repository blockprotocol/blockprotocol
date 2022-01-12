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

export const TextField: VFC<TextFieldProps> = ({ helperText, ...props }) => {
  const [recentHelperText, setRecentHelperText] = useState<
    ReactNode | undefined
  >(helperText);

  useEffect(() => {
    if (helperText) {
      setRecentHelperText(helperText);
    }
  }, [helperText]);

  return (
    <Box>
      {/** @todo: instead of using the wrapper MuiTextField component use the underlying Mui components:
       *     - [FormControl](https://mui.com/api/form-control/)
       *     - [InputLabel](https://mui.com/api/input-label/)
       *     - [FilledInput](https://mui.com/api/filled-input/)
       *     - [OutlinedInput](https://mui.com/api/outlined-input/)
       *     - [Input](https://mui.com/api/input/)
       *     - [FormHelperText](https://mui.com/api/form-helper-text/)
       */}
      <MuiTextField
        {...props}
        InputProps={{
          ...props.InputProps,
          /** @todo: figure out why this is required and the theme defaultProps cannot be relied on */
          ...{ notched: false },
          endAdornment: props.error ? (
            <Box>
              <Icon
                sx={{ fontSize: 22, color: "currentColor" }}
                className="fa-solid fa-circle-exclamation"
              />
            </Box>
          ) : (
            props.InputProps?.endAdornment
          ),
        }}
      />
      <Collapse
        in={!!helperText}
        sx={{ marginBottom: 2 }}
        onExited={() => setRecentHelperText(undefined)}
      >
        <FormHelperText error={props.error} sx={{ marginTop: 1, fontSize: 15 }}>
          {recentHelperText}
        </FormHelperText>
      </Collapse>
    </Box>
  );
};
