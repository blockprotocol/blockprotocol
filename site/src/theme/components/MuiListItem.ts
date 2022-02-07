import { Components } from "@mui/material";
import { customColors } from "../palette";
import { defaultTheme } from "../util";

export const MuiListItemButton: Components["MuiListItemButton"] = {
  defaultProps: {
    disableRipple: true,
  },
  styleOverrides: {
    root: {
      paddingLeft: defaultTheme.spacing(5),
      "&:hover": {
        backgroundColor: customColors.gray[20],
      },
      "&.Mui-selected": {
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: customColors.gray[20],
        },
        "& .MuiListItemIcon-root": {
          color: customColors.purple[700],
        },
        "& .MuiListItemText-primary": {
          color: customColors.purple[700],
          fontWeight: 600,
        },
      },
    },
  },
};

export const MuiListItemIcon: Components["MuiListItemIcon"] = {
  styleOverrides: {
    root: {
      minWidth: defaultTheme.spacing(4),
      color: customColors.gray[70],
    },
  },
};

export const MuiListItemText: Components["MuiListItemText"] = {
  styleOverrides: {
    primary: {
      fontWeight: 500,
      color: customColors.gray[70],
    },
  },
};
