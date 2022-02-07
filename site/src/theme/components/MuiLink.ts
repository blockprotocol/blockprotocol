import { Components } from "@mui/material";
import { customColors } from "../palette";

export const MuiLink: Components["MuiLink"] = {
  styleOverrides: {
    root: {
      textDecoration: "none",
      position: "relative",
      ":focus-visible": {
        border: "none",
        outline: `1px solid ${customColors.purple[700]}`,
      },
    },
  },
};
