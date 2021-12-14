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

const defaultTheme = createTheme();

// @todo use more descriptive names instead of --step-1, --step-2
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

    --f--1-min: 14;
    --f--1-max: 15;
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

    --f-5-min: 48.83;
    --f-5-max: 54.93;
    --step-5: calc(
      ((var(--f-5-min) / 16) * 1rem) + (var(--f-5-max) - var(--f-5-min)) *
        var(--fluid-bp)
    );

    --f-6-min: 61.04;
    --f-6-max: 68.66;
    --step-6: calc(
      ((var(--f-6-min) / 16) * 1rem) + (var(--f-6-max) - var(--f-6-min)) *
        var(--fluid-bp)
    );
  }
`;

// Override MUI TypeScript types to support custom theme properties
declare module "@mui/material" {
  interface Palette {
    purple: {
      50: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      subtle: string;
    };
    gray: {
      10: string;
      20: string;
      30: string;
      40: string;
      50: string;
      60: string;
      70: string;
      80: string;
    };
  }
}

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
  blue: {
    100: "#F0F9FF",
    200: "#C5EDF8",
    300: "#86DDF3",
    400: "#24BDE0",
    500: "#0A9FC0",
    600: "#007F9E",
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
      main: customColors.purple["500"],
    },
    ...customColors,
  },
  typography: {
    fontFamily: "Inter",
    bpTitle: {
      fontFamily: "Apercu Pro",
      fontSize: "var(--step-6)",
      lineHeight: 1,
      fontWeight: 700,
      color: customColors.gray["80"],
    },
    bpHeading1: {
      fontFamily: "Apercu Pro",
      fontSize: "var(--step-5)",
      lineHeight: 1.1,
      fontWeight: 700,
      color: customColors.gray["80"],
    },
    bpHeading2: {
      fontFamily: "Apercu Pro",
      fontSize: "var(--step-4)",
      fontWeight: 400,
      lineHeight: 1.2,
      color: customColors.gray["80"],
    },
    bpHeading3: {
      fontFamily: "Apercu Pro",
      fontSize: "var(--step-3)",
      lineHeight: 1.1,
      color: customColors.gray["70"],
    },
    bpSmallCaps: {
      fontFamily: "Apercu Pro",
      fontSize: "var(--step--1)",
      lineHeight: 1.3,
      color: customColors.gray["70"],
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
      "& a": {
        fontWeight: 600,
        transition: defaultTheme.transitions.create("color"),
        color: customColors.purple["500"],
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
    "0px 4px 11px rgba(39, 50, 86, 0.04), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.08), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
    "0px 11px 30px rgba(61, 78, 133, 0.04), 0px 7.12963px 18.37px rgba(61, 78, 133, 0.05), 0px 4.23704px 8.1px rgba(61, 78, 133, 0.06), 0px 0.203704px 0.62963px rgba(61, 78, 133, 0.07)",
    "0px 20px 41px rgba(61, 78, 133, 0.07), 0px 16px 25px rgba(61, 78, 133, 0.0531481), 0px 12px 12px rgba(61, 78, 133, 0.0325), 0px 2px 3.13px rgba(61, 78, 133, 0.02)",
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
            ${rootTypographyStyles}
          `,
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          bpHeading1: "h1",
          bpHeading2: "h2",
          bpHeading3: "h3",
          bpSmallCaps: "p",
          bpLargeText: "p",
          bpBodyCopy: "p",
          bpSmallCopy: "span",
          bpMicroCopy: "span",
        },
      },
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
              color: customColors.purple[600],
            },
          },
          svg: {
            color: customColors.gray[60],
            transition: defaultTheme.transitions.create("color"),
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
        disableTouchRipple: true,
      },

      // @todo consider overriding existing variants
      variants: [
        {
          props: { variant: "primary" },
          style: {
            backgroundColor: "unset",
            background: customColors.purple["500"],
            color: customColors.gray["20"], // this should be taken from list of colors
            "&:hover": {
              background: `radial-gradient(57.38% 212.75% at 50.1% 134.31%, ${customColors.blue["400"]} 0%, ${customColors.purple["500"]} 100%)`,
            },
            borderRadius: 34,
            border: `1px solid ${customColors.purple["500"]}`,
          },
        },
        {
          props: { variant: "secondary" },
          style: {
            background: customColors.gray["10"],
            color: customColors.purple["500"], // this should be taken from list of colors
            border: `1px solid currentColor`,
            "&:hover": {
              background: customColors.purple["200"],
            },
            borderRadius: 34,
          },
        },
      ],
    },
    MuiContainer: {
      styleOverrides: {
        root: {
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
              color: defaultTheme.palette.common.black,
            },
            "& .MuiListItemText-primary": {
              color: defaultTheme.palette.common.black,
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});
