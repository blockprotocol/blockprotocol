import { Components } from "@mui/material";
import { customColors } from "../palette";
import { defaultTheme } from "../util";

export const MuiOutlinedInput: Components["MuiOutlinedInput"] = {
  defaultProps: {
    notched: false,
  },
  styleOverrides: {
    root: {
      borderRadius: "6px",
      "&:hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: customColors.gray[30],
        },
      },
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: customColors.purple[600],
        },
      },
      "&.Mui-error": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: customColors.red[600],
        },
      },
    },
    input: {
      padding: defaultTheme.spacing(1.5, 2),
      fontSize: 18,
    },
    notchedOutline: {
      borderColor: customColors.gray[30],
    },
    adornedEnd: {
      "&.Mui-error": {
        svg: {
          color: customColors.red[600],
        },
      },
    },
  },
};
