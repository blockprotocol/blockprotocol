import { Components } from "@mui/material";
import { customColors } from "../palette";

export const MuiInputBase: Components["MuiInputBase"] = {
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
