import { Components } from "@mui/material";
import { customColors } from "../palette";

export const MuiListItemTextThemeOptions: Components["MuiListItemText"] = {
  styleOverrides: {
    primary: {
      fontWeight: 500,
      color: customColors.gray[70],
    },
  },
};
