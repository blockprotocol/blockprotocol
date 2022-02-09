import { Components, Theme } from "@mui/material";

export const MuiBreadcrumbsThemeOptions: Components<Theme>["MuiBreadcrumbs"] = {
  styleOverrides: {
    li: ({ theme }) => ({
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      fontSize: 14,
      color: theme.palette.gray[60],
      "> a": {
        borderBottomColor: "transparent",
      },
      "&:not(:last-child)": {
        maxWidth: 150,
      },
      "&:last-child": {
        color: theme.palette.purple[700],
      },
    }),
  },
};
