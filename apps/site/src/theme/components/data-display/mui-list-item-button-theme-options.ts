import { Components, listItemButtonClasses, Theme } from "@mui/material";

export const MuiListItemButtonThemeOptions: Components<Theme>["MuiListItemButton"] =
  {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        paddingLeft: theme.spacing(5),
        "&:hover": {
          backgroundColor: theme.palette.gray[20],
          [`& ${listItemButtonClasses.root}`]: {
            color: theme.palette.gray[90],
          },
        },
        "&.Mui-selected": {
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: theme.palette.gray[20],
          },
          "& .MuiListItemIcon-root": {
            color: theme.palette.purple[700],
          },
          "& .MuiListItemText-primary": {
            color: theme.palette.purple[700],
            fontWeight: 600,
          },
        },
      }),
    },
  };
