import { Components, CSSObject } from "@mui/material";
import { customColors } from "../../palette";
import { defaultTheme } from "../../util";

const buttonFocusBorderOffset = 6;
const buttonFocusBorderWidth = 4;

export const MuiButtonThemeOptions: Components["MuiButton"] = {
  defaultProps: {
    variant: "primary",
    color: "purple",
    disableElevation: true,
    disableRipple: true,
    disableTouchRipple: true,
  },
  styleOverrides: {
    root: ({ ownerState }) => {
      const { variant, color, size } = ownerState;

      const baseStyles: CSSObject = {
        textTransform: "none",
        fontSize: size === "small" ? 15 : size === "medium" ? 18 : undefined,
        "&:before": {},
        ":focus-visible:after": {},
      };

      const beforeStyles: CSSObject = {
        content: `""`,
        borderRadius: "inherit",
        position: "absolute",
        width: "100%",
        height: "100%",
        border: "1px solid transparent",
      };

      const hoverStyles: CSSObject = {};

      const disabledStyles: CSSObject = {};

      const activeStyles: CSSObject = {};

      const focusVisibleAfterStyles: CSSObject = {
        content: `""`,
        position: "absolute",
        left: -buttonFocusBorderOffset,
        top: -buttonFocusBorderOffset,
        bottom: -buttonFocusBorderOffset,
        right: -buttonFocusBorderOffset,
        border: `${buttonFocusBorderWidth}px solid`,
        borderRadius: 6 + buttonFocusBorderOffset,
      };

      if (variant === "primary") {
        Object.assign(baseStyles, {
          color: customColors.gray[20],
          borderRadius: 34,
          ...(size === "small" && {
            padding: defaultTheme.spacing("8px", "20px"),
          }),
          ...(size === "medium" && {
            padding: defaultTheme.spacing("12px", "28px"),
            minHeight: 51,
          }),
          ...(color &&
            {
              purple: {
                zIndex: 0,
                background: customColors.purple[600],
              },
              teal: { backgroundColor: customColors.teal[500] },
              gray: {
                color: customColors.gray[80],
                backgroundColor: customColors.gray[50],
              },
              warning: { backgroundColor: customColors.orange[500] },
              danger: { backgroundColor: customColors.red[600] },
              inherit: {},
            }[color]),
        });
        Object.assign(beforeStyles, {
          ...(color === "purple" && {
            zIndex: -1,
            opacity: 0,
            transition: defaultTheme.transitions.create("opacity"),
            background: `radial-gradient(57.38% 212.75% at 50.1% 134.31%, ${customColors.teal["400"]} 0%, ${customColors.purple[600]} 100%)`,
          }),
        });
        Object.assign(hoverStyles, {
          ...(color &&
            {
              purple: {
                background: customColors.purple[600],
                ":before": {
                  opacity: 1,
                },
              },
              teal: { backgroundColor: customColors.teal[600] },
              gray: { backgroundColor: customColors.gray[30] },
              warning: { backgroundColor: customColors.orange[600] },
              danger: { backgroundColor: customColors.red[700] },
              inherit: {},
            }[color]),
        });
        Object.assign(disabledStyles, {
          ...(color === "purple" && {
            background: customColors.purple[200],
            color: customColors.purple[100],
          }),
        });
        Object.assign(focusVisibleAfterStyles, {
          borderRadius: 34 + buttonFocusBorderOffset,
          ...(color &&
            {
              purple: { borderColor: customColors.purple[600] },
              teal: { borderColor: customColors.teal[500] },
              gray: { borderColor: customColors.gray[50] },
              warning: { borderColor: customColors.orange[500] },
              danger: { borderColor: customColors.red[700] },
              inherit: {},
            }[color]),
        });
      } else if (variant === "secondary") {
        Object.assign(baseStyles, {
          background: customColors.gray[10],
          borderRadius: 34,
          ...(size === "small" && {
            paddingTop: `calc(${defaultTheme.spacing(0.5)} - 1px)`,
            paddingBottom: `calc(${defaultTheme.spacing(0.5)} - 1px)`,
            paddingLeft: `calc(${defaultTheme.spacing(1.5)} - 1px)`,
            paddingRight: `calc(${defaultTheme.spacing(1.5)} - 1px)`,
          }),
          ...(size === "medium" && {
            padding: defaultTheme.spacing("8px", "24px"),
            minHeight: 51,
          }),
          ...(color &&
            {
              purple: { color: customColors.purple[700] },
              teal: { color: customColors.teal[600] },
              gray: { color: customColors.gray[70] },
              warning: {
                color: customColors.orange[600],
                borderColor: "#FEB173",
                background: customColors.orange[100],
              },
              danger: { color: customColors.red[600] },
              inherit: {},
            }[color]),
        });
        Object.assign(beforeStyles, {
          borderColor: "currentColor",
        });
        Object.assign(hoverStyles, {
          ...(color &&
            {
              purple: {
                background: customColors.purple[200],
                color: customColors.purple[800],
              },
              teal: {
                background: customColors.teal[200],
                color: customColors.teal[700],
              },
              gray: {
                background: customColors.gray[30],
                color: customColors.gray[70],
              },
              warning: {
                color: customColors.orange[700],
                background: customColors.orange[200],
              },
              danger: {
                background: customColors.red[200],
                color: customColors.red[700],
              },
              inherit: {},
            }[color]),
        });
        Object.assign(focusVisibleAfterStyles, {
          borderRadius: 34 + buttonFocusBorderOffset,
          ...(color &&
            {
              purple: {},
              teal: { borderColor: customColors.teal[600] },
              gray: { borderColor: customColors.gray[70] },
              warning: { borderColor: customColors.purple[600] },
              danger: {},
              inherit: {},
            }[color]),
        });
      } else if (variant === "tertiary") {
        Object.assign(baseStyles, {
          borderRadius: 34,
          color: customColors.gray[70],
          background: defaultTheme.palette.common.white,
          "& > .MuiButton-startIcon, > .MuiButton-endIcon": {
            color: customColors.gray[40],
          },
          ...(size === "small" && {
            paddingTop: `calc(${defaultTheme.spacing(0.5)} - 1px)`,
            paddingBottom: `calc(${defaultTheme.spacing(0.5)} - 1px)`,
            paddingLeft: `calc(${defaultTheme.spacing(1.5)} - 1px)`,
            paddingRight: `calc(${defaultTheme.spacing(1.5)} - 1px)`,
          }),
          ...(size === "medium" && {
            paddingTop: `calc(${defaultTheme.spacing(1.25)} - 1px)`,
            paddingBottom: `calc(${defaultTheme.spacing(1.25)} - 1px)`,
            paddingLeft: `calc(${defaultTheme.spacing(2.5)} - 1px)`,
            paddingRight: `calc(${defaultTheme.spacing(2.5)} - 1px)`,
          }),
          ...(color === "purple" && {
            color: customColors.purple[700],
            borderColor: customColors.purple[700],
          }),
        });
        Object.assign(beforeStyles, {
          borderColor: "#C1CFDE",
        });
        Object.assign(hoverStyles, {
          ...(color &&
            {
              purple: {
                color: customColors.purple[700],
                borderColor: customColors.purple[500],
                background: customColors.purple[100],
                "& > .MuiButton-startIcon, > .MuiButton-endIcon": {
                  color: customColors.purple[300],
                },
              },
              teal: {},
              gray: {},
              warning: {
                color: customColors.orange[600],
                borderColor: "#FEB173",
                background: customColors.orange[100],
                "& > .MuiButton-startIcon, > .MuiButton-endIcon": {
                  color: customColors.orange[300],
                },
              },
              danger: {},
              inherit: {},
            }[color]),
        });
        Object.assign(activeStyles, {
          ...(color &&
            {
              purple: {
                borderColor: customColors.purple[700],
                background: customColors.purple[700],
                color: customColors.purple[100],
                "& > .MuiButton-startIcon, > .MuiButton-endIcon": {
                  color: customColors.purple[100],
                },
              },
              teal: {},
              gray: {},
              warning: {},
              danger: {},
              inherit: {},
            }[color]),
        });
        Object.assign(focusVisibleAfterStyles, {
          borderRadius: 34 + buttonFocusBorderOffset,
        });
      } else if (variant === "transparent") {
        Object.assign(baseStyles, {
          minWidth: "unset",
          padding: "unset",
          color: customColors.gray[50],
        });
        Object.assign(hoverStyles, {
          color: customColors.purple[600],
          backgroundColor: "unset",
        });
        Object.assign(focusVisibleAfterStyles, {
          borderWidth: 1,
          bottom: 0,
          top: 0,
          borderRadius: 0,
        });
      }

      return {
        ...baseStyles,
        "&:before": beforeStyles,
        ":hover": hoverStyles,
        ":active": activeStyles,
        "&.Mui-disabled": disabledStyles,
        ":focus-visible:after": focusVisibleAfterStyles,
      };
    },
    endIcon: {
      "&>*:nth-of-type(1)": {
        fontSize: "inherit",
      },
    },
    startIcon: {
      "&>*:nth-of-type(1)": {
        fontSize: "inherit",
      },
    },
  },
};
