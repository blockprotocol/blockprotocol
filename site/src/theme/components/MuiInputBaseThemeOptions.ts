import { Components } from "@mui/material";
import { customColors } from "../palette";

export const MuiInputBaseThemeOptions: Components["MuiInputBase"] = {
  styleOverrides: {
    adornedEnd: {
      "&.Mui-error": {
        svg: {
          color: customColors.red[600],
        },
      },
    },
  },
};
