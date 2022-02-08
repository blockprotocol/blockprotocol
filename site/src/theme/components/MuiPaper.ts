import { Components } from "@mui/material";
import { customColors } from "../palette";

export const MuiPaper: Components["MuiPaper"] = {
  styleOverrides: {
    root: ({ ownerState }) => ({
      borderRadius: 10,
      ...((ownerState.variant === "teal" ||
        ownerState.variant === "purple") && {
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "6px",
      }),
      ...(ownerState.variant === "teal" && {
        borderColor: "#B0DDE9",
        backgroundColor: customColors.teal[100],
      }),
      ...(ownerState.variant === "purple" && {
        borderColor: customColors.purple[200],
        backgroundColor: customColors.purple[100],
      }),
    }),
  },
};
