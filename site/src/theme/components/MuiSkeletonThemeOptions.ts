import { Components } from "@mui/material";
import { customColors } from "../palette";

export const MuiSkeletonThemeOptions: Components["MuiSkeleton"] = {
  styleOverrides: {
    root: {
      backgroundColor: customColors.gray["20"],
    },
  },
};
