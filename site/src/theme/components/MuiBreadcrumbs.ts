import { Components } from "@mui/material";
import { customColors } from "../palette";

export const MuiBreadcrumbs: Components["MuiBreadcrumbs"] = {
  styleOverrides: {
    li: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      fontSize: 14,
      color: customColors.gray[60],
      "> a": {
        borderBottomColor: "transparent",
      },
      "&:not(:last-child)": {
        maxWidth: 150,
      },
      "&:last-child": {
        color: customColors.purple[700],
      },
    },
  },
};
