import { alertClasses, AlertColor, Components, Theme } from "@mui/material";

export const MuiAlertThemeOptions: Components<Theme>["MuiAlert"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.palette.gray["20"],
    }),
    standard: ({ ownerState, theme }) => {
      const { palette, spacing } = theme;
      const { severity } = ownerState;

      const severityColors: Record<
        AlertColor,
        {
          icon: string;
          border: string;
          bg: string;
          codeBg: string;
          codeBorder: string;
        }
      > = {
        error: {
          icon: palette.red[600],
          bg: palette.red[100],
          border: palette.red[300],
          codeBg: palette.red[200],
          codeBorder: palette.red[300],
        },
        info: {
          icon: palette.purple[200],
          bg: palette.purple[100],
          border: palette.purple[300],
          codeBg: palette.purple[20],
          codeBorder: palette.purple[30],
        },
        success: {
          icon: palette.green[60],
          bg: palette.green[10],
          border: palette.green[30],
          codeBg: palette.green[20],
          codeBorder: palette.green[40],
        },
        warning: {
          icon: palette.orange[300],
          bg: palette.orange[100],
          border: palette.orange[300],
          codeBg: palette.orange[200],
          codeBorder: palette.orange[300],
        },
      };

      const colors = severityColors[severity || "info"];

      return {
        border: `1px solid ${colors.border}`,
        width: "100%",
        alignItems: "center",
        padding: spacing(3, 4),
        background: colors.bg,

        [`.${alertClasses.icon}`]: {
          marginRight: spacing(3),
          svg: {
            color: colors.icon,
            fontSize: spacing(4),
          },
        },

        [`.${alertClasses.message}`]: {
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          overflow: "visible",
          padding: 0,
        },

        code: {
          background: colors.codeBg,
          borderColor: colors.codeBorder,
        },
      };
    },
  },
};
