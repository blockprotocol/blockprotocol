import { Components } from "@mui/material";
import { customColors } from "../../palette";
import { defaultTheme } from "../../util";

export const MuiListItemButtonThemeOptions: Components["MuiListItemButton"] = {
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
