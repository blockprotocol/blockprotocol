import { Components } from "@mui/material";
import { customColors } from "../palette";

export const MuiPaper: Components["MuiPaper"] = {
  styleOverrides: {
    root: {
      borderRadius: 10,
    },
  },
  variants: [
    {
      props: {
        variant: "teal",
      },
      style: {
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "6px",
        borderColor: "#B0DDE9",
        backgroundColor: customColors.teal[100],
      },
    },
    {
      props: {
        variant: "purple",
      },
      style: {
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "6px",
        borderColor: customColors.purple[200],
        backgroundColor: customColors.purple[100],
      },
    },
  ],
};
