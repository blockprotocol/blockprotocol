import { Components } from "@mui/material";
import { customColors } from "../palette";
import { defaultTheme } from "../util";

const buttonFocusBorderOffset = 6;
const buttonFocusBorderWidth = 4;

export const MuiButton: Components["MuiButton"] = {
  defaultProps: {
    variant: "primary",
    color: "purple",
    disableElevation: true,
    disableRipple: true,
    disableTouchRipple: true,
  },
  styleOverrides: {
    root: {
      textTransform: "none",
      "&:before": {
        content: `""`,
        borderRadius: "inherit",
        position: "absolute",
        width: "100%",
        height: "100%",
        border: "1px solid transparent",
      },
      ":focus-visible:after": {
        content: `""`,
        position: "absolute",
        left: -buttonFocusBorderOffset,
        top: -buttonFocusBorderOffset,
        bottom: -buttonFocusBorderOffset,
        right: -buttonFocusBorderOffset,
        border: `${buttonFocusBorderWidth}px solid`,
        borderRadius: 6 + buttonFocusBorderOffset,
      },
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
  variants: [
    {
      props: { variant: "transparent" },
      style: {
        minWidth: "unset",
        padding: "unset",
        color: customColors.gray[50],
        ":hover": {
          color: customColors.purple[600],
          backgroundColor: "unset",
        },
        ":focus-visible:after": {
          borderWidth: 1,
          bottom: 0,
          top: 0,
          borderRadius: 0,
        },
      },
    },
    {
      props: { variant: "primary" },
      style: {
        color: customColors.gray["20"],
        borderRadius: 34,
        ":focus-visible:after": {
          borderRadius: 34 + buttonFocusBorderOffset,
        },
      },
    },
    {
      props: { variant: "secondary" },
      style: {
        background: customColors.gray[10],
        borderRadius: 34,
        ":before": {
          borderColor: "currentColor",
        },
        ":focus-visible:after": {
          borderRadius: 34 + buttonFocusBorderOffset,
        },
      },
    },
    {
      props: { variant: "tertiary" },
      style: {
        borderRadius: 34,
        color: customColors.gray[70],
        ":before": {
          borderColor: "#C1CFDE",
        },
        ":focus-visible:after": {
          borderRadius: 34 + buttonFocusBorderOffset,
        },
        background: defaultTheme.palette.common.white,
        "& > .MuiButton-startIcon, > .MuiButton-endIcon": {
          color: customColors.gray[40],
        },
      },
    },
    {
      props: { size: "medium" },
      style: {
        fontSize: 18,
      },
    },
    {
      props: { variant: "primary", size: "medium" },
      style: {
        padding: defaultTheme.spacing("12px", "28px"),
        minHeight: 51,
      },
    },
    {
      props: { variant: "secondary", size: "medium" },
      style: {
        padding: defaultTheme.spacing("8px", "24px"),
        minHeight: 51,
      },
    },
    {
      props: { variant: "tertiary", size: "medium" },
      style: {
        paddingTop: `calc(${defaultTheme.spacing(1.25)} - 1px)`,
        paddingBottom: `calc(${defaultTheme.spacing(1.25)} - 1px)`,
        paddingLeft: `calc(${defaultTheme.spacing(2.5)} - 1px)`,
        paddingRight: `calc(${defaultTheme.spacing(2.5)} - 1px)`,
      },
    },
    {
      props: { size: "small" },
      style: {
        fontSize: 15,
      },
    },
    {
      props: { variant: "primary", size: "small" },
      style: {
        padding: defaultTheme.spacing("8px", "20px"),
      },
    },
    {
      props: { variant: "secondary", size: "small" },
      style: {
        paddingTop: `calc(${defaultTheme.spacing(0.5)} - 1px)`,
        paddingBottom: `calc(${defaultTheme.spacing(0.5)} - 1px)`,
        paddingLeft: `calc(${defaultTheme.spacing(1.5)} - 1px)`,
        paddingRight: `calc(${defaultTheme.spacing(1.5)} - 1px)`,
      },
    },
    {
      props: { variant: "tertiary", size: "small" },
      style: {
        paddingTop: `calc(${defaultTheme.spacing(0.5)} - 1px)`,
        paddingBottom: `calc(${defaultTheme.spacing(0.5)} - 1px)`,
        paddingLeft: `calc(${defaultTheme.spacing(1.5)} - 1px)`,
        paddingRight: `calc(${defaultTheme.spacing(1.5)} - 1px)`,
      },
    },
    {
      props: { variant: "primary", color: "purple" },
      style: {
        zIndex: 0,
        background: customColors.purple[600],
        "&.Mui-disabled": {
          background: customColors.purple[200],
          color: customColors.purple[100],
        },
        ":before": {
          zIndex: -1,
          opacity: 0,
          transition: defaultTheme.transitions.create("opacity"),
          background: `radial-gradient(57.38% 212.75% at 50.1% 134.31%, ${customColors.teal["400"]} 0%, ${customColors.purple[600]} 100%)`,
        },
        ":hover": {
          background: customColors.purple[600],
          ":before": {
            opacity: 1,
          },
        },
        ":focus-visible:after": {
          borderColor: customColors.purple[600],
        },
      },
    },
    {
      props: { variant: "primary", color: "teal" },
      style: {
        backgroundColor: customColors.teal[500],
        ":hover": {
          backgroundColor: customColors.teal[600],
        },
        ":focus-visible:after": {
          borderColor: customColors.teal[500],
        },
      },
    },
    {
      props: { variant: "primary", color: "gray" },
      style: {
        color: customColors.gray[80],
        backgroundColor: customColors.gray[50],
        ":hover": {
          backgroundColor: customColors.gray[30],
        },
        ":focus-visible:after": {
          borderColor: customColors.gray[50],
        },
      },
    },
    {
      props: { variant: "primary", color: "warning" },
      style: {
        backgroundColor: customColors.orange[500],
        ":hover": {
          backgroundColor: customColors.orange[600],
        },
        ":focus-visible:after": {
          borderColor: customColors.orange[500],
        },
      },
    },
    {
      props: { variant: "primary", color: "danger" },
      style: {
        backgroundColor: customColors.red[600],
        ":hover": {
          backgroundColor: customColors.red[700],
        },
        ":focus-visible:after": {
          borderColor: customColors.purple[700],
        },
      },
    },
    {
      props: { variant: "secondary", color: "purple" },
      style: {
        color: customColors.purple[700],
        ":hover": {
          background: customColors.purple[200],
          color: customColors.purple[800],
        },
      },
    },
    {
      props: { variant: "secondary", color: "teal" },
      style: {
        color: customColors.teal[600],
        ":hover": {
          background: customColors.teal[200],
          color: customColors.teal[700],
        },
        ":focus-visible:after": {
          borderColor: customColors.teal[600],
        },
      },
    },
    {
      props: { variant: "secondary", color: "gray" },
      style: {
        color: customColors.gray[70],
        ":hover": {
          background: customColors.gray[30],
          color: customColors.gray[70],
        },
        ":focus-visible:after": {
          borderColor: customColors.gray[70],
        },
      },
    },
    {
      props: { variant: "secondary", color: "warning" },
      style: {
        color: customColors.orange[600],
        borderColor: "#FEB173",
        background: customColors.orange[100],
        ":hover": {
          color: customColors.orange[700],
          background: customColors.orange[200],
        },
        ":focus-visible:after": {
          borderColor: customColors.purple[600],
        },
      },
    },
    {
      props: { variant: "secondary", color: "danger" },
      style: {
        color: customColors.red[600],
        ":hover": {
          background: customColors.red[200],
          color: customColors.red[700],
        },
      },
    },
    {
      props: { variant: "tertiary", color: "purple" },
      style: {
        color: customColors.purple[700],
        borderColor: customColors.purple[700],
        ":hover": {
          color: customColors.purple[700],
          borderColor: customColors.purple[500],
          background: customColors.purple[100],
          "& > .MuiButton-startIcon, > .MuiButton-endIcon": {
            color: customColors.purple[300],
          },
        },
        ":active": {
          borderColor: customColors.purple[700],
          background: customColors.purple[700],
          color: customColors.purple[100],
          "& > .MuiButton-startIcon, > .MuiButton-endIcon": {
            color: customColors.purple[100],
          },
        },
      },
    },
    {
      props: { variant: "tertiary", color: "warning" },
      style: {
        ":hover": {
          color: customColors.orange[600],
          borderColor: "#FEB173",
          background: customColors.orange[100],
          "& > .MuiButton-startIcon, > .MuiButton-endIcon": {
            color: customColors.orange[300],
          },
        },
      },
    },
  ],
};
