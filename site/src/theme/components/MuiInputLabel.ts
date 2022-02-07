import { Components } from "@mui/material";
import { defaultTheme } from "../util";

export const MuiInputLabel: Components["MuiInputLabel"] = {
  defaultProps: {
    disableAnimation: true,
    shrink: true,
  },
  styleOverrides: {
    root: {
      position: "unset",
      left: "unset",
      top: "unset",
      transform: "unset",
      fontSize: 15,
      fontWeight: 500,
      marginBottom: defaultTheme.spacing(0.5),
    },
  },
};
