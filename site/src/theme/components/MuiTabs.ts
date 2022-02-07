import { Components } from "@mui/material";
import { customColors } from "../palette";
import { defaultTheme } from "../util";

export const MuiTabs: Components["MuiTabs"] = {
  defaultProps: {
    disableRipple: true,
    disableTouchRipple: true,
  },
  styleOverrides: {
    indicator: {
      height: 5,
    },
  },
};

export const MuiTab: Components["MuiTab"] = {
  defaultProps: {
    disableFocusRipple: true,
    disableRipple: true,
    disableTouchRipple: true,
    tabIndex: 0,
  },
  styleOverrides: {
    root: {
      border: "1px solid transparent",
      textTransform: "none",
      padding: defaultTheme.spacing(1, 0),
      marginRight: defaultTheme.spacing(3),
      "&:focus-visible": {
        borderColor: customColors.purple[600],
      },
    },
    textColorPrimary: {
      color: customColors.gray[70],
    },
  },
};
