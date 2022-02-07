import { Components } from "@mui/material";
import { customColors } from "../palette";

export const MuiSkeleton: Components["MuiSkeleton"] = {
  styleOverrides: {
    root: {
      backgroundColor: customColors.gray["20"],
    },
  },
};
