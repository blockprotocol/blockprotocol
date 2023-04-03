import { Components, Theme } from "@mui/material";

export const MuiTextFieldThemeOptions: Components<Theme>["MuiTextField"] = {
  defaultProps: {
    InputLabelProps: {
      disableAnimation: true,
      shrink: true,
    },
    InputProps: {
      notched: false,
    },
  },
};
