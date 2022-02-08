import { Components } from "@mui/material";
import { customColors } from "../palette";
import { defaultTheme } from "../util";

export const MuiIconButtonThemeOptions: Components["MuiIconButton"] = {
  defaultProps: {
    disableFocusRipple: true,
    disableRipple: true,
    disableTouchRipple: true,
  },
  styleOverrides: {
    root: {
      "&:hover": {
        svg: {
          color: customColors.purple[600],
        },
      },
      "&:active": {
        svg: {
          color: customColors.purple[700],
        },
      },
      "&:focus": {
        border: "none !important",
        borderRadius: 0,
      },
      "&:focus-visible": {
        borderRadius: 0,
        border: "none !important",
        outline: `1px solid ${customColors.purple[600]}`,
      },
      svg: {
        color: customColors.gray[60],
        transition: defaultTheme.transitions.create("color"),
      },
    },
  },
};
