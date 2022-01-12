import { createTheme } from "@mui/material";

import InterMedium from "../assets/fonts/Inter-Medium.ttf";
import InterRegular from "../assets/fonts/Inter-Regular.ttf";
import InterSemiBold from "../assets/fonts/Inter-SemiBold.ttf";
import InterBold from "../assets/fonts/Inter-Bold.ttf";
import InterLight from "../assets/fonts/Inter-Light.ttf";
import ApercuProRegular from "../assets/fonts/apercu-regular-pro.ttf";
import ApercuProBold from "../assets/fonts/apercu-bold-pro.ttf";
import ApercuProLight from "../assets/fonts/apercu-light-pro.ttf";
import ApercuProMedium from "../assets/fonts/apercu-medium-pro.ttf";
import { DESKTOP_NAVBAR_HEIGHT } from "./Navbar";

const defaultTheme = createTheme();

const FALLBACK_FONTS = [`"Helvetica"`, `"Arial"`, "sans-serif"];

// @todo use more descriptive names instead of --step-1, --step-2
// wouldn't need this when this is in
// @see https://github.com/mui-org/material-ui/issues/15251
const rootTypographyStyles = `
  /* @link https://utopia.fyi/type/calculator?c=320,16,1.25,1140,18,1.25,6,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l */

  :root {
    --fluid-min-width: 320;
    --fluid-max-width: 1140;

    --fluid-screen: 100vw;
    --fluid-bp: calc(
      (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) /
        (var(--fluid-max-width) - var(--fluid-min-width))
    );
  }

  @media screen and (min-width: 1140px) {
    :root {
      --fluid-screen: calc(var(--fluid-max-width) * 1px);
    }
  }

  :root {
    --f--2-min: 13;
    --f--2-max: 14;
    --step--2: calc(
      ((var(--f--2-min) / 16) * 1rem) + (var(--f--2-max) - var(--f--2-min)) *
        var(--fluid-bp)
    );

    --f--1-min: 14.50;
    --f--1-max: 15.50;
    --step--1: calc(
      ((var(--f--1-min) / 16) * 1rem) + (var(--f--1-max) - var(--f--1-min)) *
        var(--fluid-bp)
    );

    --f-0-min: 16.00;
    --f-0-max: 18.00;
    --step-0: calc(
      ((var(--f-0-min) / 16) * 1rem) + (var(--f-0-max) - var(--f-0-min)) *
        var(--fluid-bp)
    );

    --f-1-min: 20.00;
    --f-1-max: 22.50;
    --step-1: calc(
      ((var(--f-1-min) / 16) * 1rem) + (var(--f-1-max) - var(--f-1-min)) *
        var(--fluid-bp)
    );

    --f-2-min: 25.00;
    --f-2-max: 28.13;
    --step-2: calc(
      ((var(--f-2-min) / 16) * 1rem) + (var(--f-2-max) - var(--f-2-min)) *
        var(--fluid-bp)
    );

    --f-3-min: 31.25;
    --f-3-max: 35.16;
    --step-3: calc(
      ((var(--f-3-min) / 16) * 1rem) + (var(--f-3-max) - var(--f-3-min)) *
        var(--fluid-bp)
    );

    --f-4-min: 39.06;
    --f-4-max: 43.95;
    --step-4: calc(
      ((var(--f-4-min) / 16) * 1rem) + (var(--f-4-max) - var(--f-4-min)) *
        var(--fluid-bp)
    );

    --f-5-min: 43.95;
    --f-5-max: 54.93;
    --step-5: calc(
      ((var(--f-5-min) / 16) * 1rem) + (var(--f-5-max) - var(--f-5-min)) *
        var(--fluid-bp)
    );

    --f-6-min: 54.93;
    --f-6-max: 68.66;
    --step-6: calc(
      ((var(--f-6-min) / 16) * 1rem) + (var(--f-6-max) - var(--f-6-min)) *
        var(--fluid-bp)
    );
  }
`;

const customColors = {
  purple: {
    100: "#F4F3FF",
    200: "#D9D6FE",
    300: "#BDB4FE",
    400: "#AD9EFF",
    500: "#9B8AFB",
    600: "#6F59EC",
    700: "#6048E5",
    800: "#4732BA",
    subtle: "#C3CAE7",
  },
  teal: {
    100: "#F0F9FF",
    200: "#D8F1F8",
    300: "#9ED9E9",
    400: "#24BDE0",
    500: "#0A9FC0",
    600: "#0081A1",
    700: "#00586E",
  },
  orange: {
    100: "#FFF6ED",
    200: "#FDDCAB",
    300: "#FEB273",
    400: "#F58C4B",
    500: "#ED6F28",
    600: "#C74E0B",
    700: "#8F2F14",
  },
  red: {
    100: "#FCF3F6",
    200: "#F4C2D4",
    300: "#EE9BB9",
    400: "#E7749D",
    500: "#E04D82",
    600: "#D92666",
    700: "#AE1E52",
    800: "#82173D",
  },
  // should adjust to be consistent with the ones above
  gray: {
    10: "#FAFBFC",
    20: "#F2F5FA",
    30: "#D8DFE5",
    40: "#C5D1DB",
    50: "#9EACBA",
    60: "#64778C",
    70: "#4D5C6C",
    80: "#37434F",
  },
  grey: undefined,
  black: "#0E1114",
  white: "#FFFFFF",
};

export const theme = createTheme({
  palette: {
    primary: {
      main: customColors.purple[600],
    },
    ...customColors,
  },
  typography: {
    fontFamily: [`"Inter"`, ...FALLBACK_FONTS].join(", "),
    fontSize: 16,
    bpTitle: {
      fontFamily: [`"Apercu Pro"`, ...FALLBACK_FONTS].join(", "),
      fontSize: "var(--step-6)",
      lineHeight: 1,
      fontWeight: 700,
      color: customColors.gray["80"],
    },
    bpSubtitle: {
      fontFamily: [`"Apercu Pro"`, ...FALLBACK_FONTS].join(", "),
      fontSize: "var(--step-3)",
      lineHeight: 1.1,
      fontWeight: 200,
      color: customColors.gray["80"],
    },
    bpHeading1: {
      fontFamily: [`"Apercu Pro"`, ...FALLBACK_FONTS].join(", "),
      fontSize: "var(--step-5)",
      lineHeight: 1.1,
      fontWeight: 700,
      color: customColors.gray["80"],
    },
    bpHeading2: {
      fontFamily: [`"Apercu Pro"`, ...FALLBACK_FONTS].join(", "),
      fontSize: "var(--step-4)",
      fontWeight: 400,
      lineHeight: 1.2,
      color: customColors.gray["80"],
    },
    bpHeading3: {
      fontFamily: [`"Apercu Pro"`, ...FALLBACK_FONTS].join(", "),
      fontSize: "var(--step-3)",
      lineHeight: 1.1,
      color: customColors.gray["70"],
    },
    bpHeading4: {
      fontFamily: [`"Apercu Pro"`, ...FALLBACK_FONTS].join(", "),
      fontSize: "var(--step-2)",
      lineHeight: 1.1,
      color: customColors.gray["70"],
    },
    bpSmallCaps: {
      fontFamily: [`"Apercu Pro"`, ...FALLBACK_FONTS].join(", "),
      fontSize: "var(--step--1)",
      lineHeight: 1.3,
      color: customColors.gray["70"],
      textTransform: "uppercase",
    },
    bpLargeText: {
      fontSize: "var(--step-1)",
      lineHeight: 1.1,
      color: customColors.gray["80"],
    },
    bpBodyCopy: {
      fontSize: "var(--step-0)",
      fontWeight: 400,
      lineHeight: 1.7,
      color: customColors.gray["80"],
      maxWidth: "62ch",
      "& a": {
        fontWeight: 600,
        transition: defaultTheme.transitions.create("color"),
        color: customColors.purple[600],
        "&:hover": {
          color: customColors.purple["600"],
        },
      },
      /** @todo: figure out how to type this */
    } as any,
    bpSmallCopy: {
      fontWeight: 500,
      fontSize: "var(--step--1)",
      lineHeight: 1.5,
      color: customColors.gray["80"],
    },
    bpMicroCopy: {
      fontWeight: 500,
      fontSize: "var(--step--2)",
      lineHeight: 1.1,
      color: customColors.gray["80"],
    },
  },
  // @todo see if it's possible to use keys "sm" | "lg" instead of the array index
  shadows: [
    "none",
    "0px 2px 8px rgba(39, 50, 86, 0.04), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.06), 0px 0.5px 1px rgba(39, 50, 86, 0.10)",
    "0px 9px 26px rgba(61, 78, 133, 0.03), 0px 7.12963px 18.37px rgba(61, 78, 133, 0.04), 0px 4.23704px 8.1px rgba(61, 78, 133, 0.05), 0px 0.203704px 0.62963px rgba(61, 78, 133, 0.06)",
    "0px 20px 41px rgba(61, 78, 133, 0.04), 0px 16px 25px rgba(61, 78, 133, 0.03), 0px 12px 12px rgba(61, 78, 133, 0.02), 0px 2px 3.13px rgba(61, 78, 133, 0.01)",
    "0px 51px 87px rgba(50, 65, 111, 0.07), 0px 33.0556px 50.9514px rgba(50, 65, 111, 0.0531481), 0px 19.6444px 27.7111px rgba(50, 65, 111, 0.0425185), 0px 10.2px 14.1375px rgba(50, 65, 111, 0.035), 0px 4.15556px 7.08889px rgba(50, 65, 111, 0.0274815), 0px 0.944444px 3.42361px rgba(50, 65, 111, 0.0168519)",
    "0px 96px 129px rgba(61, 78, 133, 0.13), 0px 48.6px 56.2359px rgba(61, 78, 133, 0.08775), 0px 19.2px 20.9625px rgba(61, 78, 133, 0.065), 0px 4.2px 7.45781px rgba(61, 78, 133, 0.04225)",
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: `
            @font-face {
              font-family: 'Inter';
              font-weight: 300;
              src: url(${InterLight}) format("trueType");
            }
            @font-face {
                font-family: 'Inter';
                font-weight: 400;
                src: url(${InterRegular}) format("trueType");
            }
            @font-face {
                font-family: 'Inter';
                font-weight: 500;
                src: url(${InterMedium}) format("trueType");
            }
            @font-face {
              font-family: 'Inter';
              font-weight: 600;
              src: url(${InterSemiBold}) format("trueType");
            }
            @font-face {
              font-family: 'Inter';
              font-weight: 700;
              src: url(${InterBold}) format("trueType");
            }
            @font-face {
              font-family: 'Apercu Pro';
              font-weight: 300;
              src: url(${ApercuProLight}) format("trueType");
            }
            @font-face {
                font-family: 'Apercu Pro';
                font-weight: 400;
                src: url(${ApercuProRegular}) format("trueType");
            }
            @font-face {
                font-family: 'Apercu Pro';
                font-weight: 500;
                src: url(${ApercuProMedium}) format("trueType");
            }
            @font-face {
              font-family: 'Apercu Pro';
              font-weight: 700;
              src: url(${ApercuProBold}) format("trueType");
            }

            html {
              scroll-behavior: smooth;
            }

            body {
              overflow: auto;${
                "" /** @todo: find a pernament solution for preventing the navbar from shifting to the right when a modal is opened on an overflowing page */
              }
            }

            body, p {
              font-size: var(--step-0);
              font-weight: 400;
              line-height: 1.7;
              color: ${customColors.gray["80"]};
            }

            pre {
              margin: unset;
            }

            :target:before {
              content: "";
              display: block;
              height: ${DESKTOP_NAVBAR_HEIGHT}px;
              margin: -${DESKTOP_NAVBAR_HEIGHT}px 0 0;
            }

            ${rootTypographyStyles}
          `,
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          bpTitle: "h1",
          bpSubtitle: "p",
          bpHeading1: "h1",
          bpHeading2: "h2",
          bpHeading3: "h3",
          bpSmallCaps: "p",
          bpLargeText: "p",
          bpBodyCopy: "p",
          bpSmallCopy: "span",
          bpMicroCopy: "span",
        },
        variant: "bpBodyCopy",
      },
      variants: [
        {
          props: {
            variant: "bpBodyCopy",
          },
          style: {
            "& a": {
              fontWeight: 600,
              color: customColors.purple[700],
              borderBottomWidth: 2,
              borderBottomColor: customColors.purple[700],
              borderBottomStyle: "solid",
              transition: defaultTheme.transitions.create("color"),
              ":hover": {
                color: customColors.purple[500],
                borderBottomColor: customColors.purple[500],
              },
            },
          },
        },
        {
          props: {
            variant: "bpSmallCopy",
          },
          style: {
            "& a": {
              color: "currentColor",
              borderBottomWidth: 2,
              borderBottomColor: "currentColor",
              borderBottomStyle: "solid",
              transition: defaultTheme.transitions.create("color"),
              ":hover": {
                color: customColors.purple[700],
                borderBottomColor: customColors.purple[700],
              },
            },
          },
        },
      ],
    },
    MuiIconButton: {
      defaultProps: {
        disableFocusRipple: true,
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          "&:hover": {
            svg: {
              color: customColors.purple[600],
            },
          },
          "&:active": {
            svg: {
              color: customColors.purple[700],
            },
          },
          svg: {
            color: customColors.gray[60],
            transition: defaultTheme.transitions.create("color"),
          },
        },
      },
    },
    MuiPaper: {
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
    },
    MuiButton: {
      defaultProps: {
        variant: "primary",
        color: "purple",
        disableElevation: true,
        disableRipple: true,
        disableTouchRipple: true,
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
          },
        },
        {
          props: { variant: "primary" },
          style: {
            color: customColors.gray["20"],
            borderRadius: 34,
          },
        },
        {
          props: { variant: "secondary" },
          style: {
            background: customColors.gray[10],
            border: `1px solid currentColor`,
            borderRadius: 34,
          },
        },
        {
          props: { variant: "tertiary" },
          style: {
            border: `1px solid currentColor`,
            borderRadius: 34,
            color: customColors.gray[70],
            borderColor: "#C1CFDE",
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
            overflow: "hidden",
            background: customColors.purple[600],
            "&.Mui-disabled": {
              background: customColors.purple[200],
              color: customColors.purple[100],
            },
            "&:before": {
              zIndex: -1,
              position: "absolute",
              width: "100%",
              height: "100%",
              content: `""`,
              opacity: 0,
              transition: defaultTheme.transitions.create("opacity"),
              background: `radial-gradient(57.38% 212.75% at 50.1% 134.31%, ${customColors.teal["400"]} 0%, ${customColors.purple[600]} 100%)`,
            },
            "&:hover": {
              background: customColors.purple[600],
              "&:before": {
                opacity: 1,
              },
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
          },
        },
        {
          props: { variant: "primary", color: "gray" },
          style: {
            backgroundColor: customColors.gray[60],
            ":hover": {
              backgroundColor: customColors.gray[70],
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
          },
        },
        {
          props: { variant: "primary", color: "danger" },
          style: {
            backgroundColor: customColors.red[600],
            ":hover": {
              backgroundColor: customColors.red[700],
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
      styleOverrides: {
        root: {
          textTransform: "none",
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
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (min-width: 1200px)": {
            maxWidth: "1400px",
          },
          paddingLeft: "16px",
          paddingRight: "16px",
          "@media (min-width): 900px": {
            paddingLeft: "32px",
            paddingRight: "32px",
          },
        },
      },
    },
    MuiIcon: {
      defaultProps: {
        baseClassName: "fas",
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: customColors.gray["20"],
        },
      },
    },
    MuiListItemButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          paddingLeft: defaultTheme.spacing(5),
          "&:hover": {
            backgroundColor: customColors.gray[20],
          },
          "&.Mui-selected": {
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: customColors.gray[20],
            },
            "& .MuiListItemIcon-root": {
              color: customColors.purple[700],
            },
            "& .MuiListItemText-primary": {
              color: customColors.purple[700],
              fontWeight: 600,
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: defaultTheme.spacing(4),
          color: customColors.gray[70],
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
          color: customColors.gray[70],
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
        disableTouchRipple: true,
      },
    },
    MuiTabs: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        indicator: {
          height: 5,
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableFocusRipple: true,
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: defaultTheme.spacing(1, 0),
          marginRight: defaultTheme.spacing(3),
        },
        textColorPrimary: {
          color: customColors.gray[70],
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        li: {
          whiteSpace: "nowrap",
          overflow: "hidden",
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
    },
    MuiFormControl: {
      defaultProps: {},
      styleOverrides: {
        root: {
          display: "block",
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        disableAnimation: true,
        shrink: true,
      },
      styleOverrides: {
        root: {
          position: "unset",
          left: "unset",
          top: "unset",
          transform: "unset",
          fontSize: 15,
          fontWeight: 500,
          marginBottom: defaultTheme.spacing(0.5),
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        adornedEnd: {
          "&.Mui-error": {
            svg: {
              color: customColors.red[600],
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
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
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          disableAnimation: true,
          shrink: true,
        },
        InputProps: {
          notched: false,
        },
      },
    },
  },
});
