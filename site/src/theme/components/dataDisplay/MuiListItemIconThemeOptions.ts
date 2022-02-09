import { Components } from "@mui/material";
import { customColors } from "../../palette";
import { defaultTheme } from "../../util";

export const MuiListItemIconThemeOptions: Components["MuiListItemIcon"] = {
  styleOverrides: {
    root: {
      minWidth: defaultTheme.spacing(4),
      color: customColors.gray[70],
    },
  },
};
