import { alertClasses, Components, Theme } from "@mui/material";

export const MuiAlertThemeOptions: Components<Theme>["MuiAlert"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      alignItems: "center",
      padding: theme.spacing(3, 4),

      ...(ownerState.severity === "info" &&
        ownerState.variant === "standard" && {
          background: theme.palette.purple[100],

          [`.${alertClasses.icon}`]: {
            marginRight: theme.spacing(3),
            svg: {
              color: theme.palette.purple[200],
              fontSize: theme.spacing(4)
            }
          },

          [`.${alertClasses.message}`]: {
            overflow: "visible",
            padding: 0
          }
        })
    })
  }
};
