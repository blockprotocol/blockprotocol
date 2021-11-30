import { colors, createTheme, Shadows } from "@mui/material";

import InterMedium from "../assets/fonts/Inter-Medium.ttf";
import InterRegular from "../assets/fonts/Inter-Regular.ttf";
import ApercuProRegular from "../assets/fonts/apercu-regular-pro.ttf";
import ApercuProBold from "../assets/fonts/Apercu-bold-pro.ttf";

const customColors = {
  // ...colors,
  purple: {
    50: "#F4F3FF",
    200: "#D9D6FE",
    300: "#BDB4FE",
    400: "#9B8AFB",
    500: "#6F59EC",
    600: "#4B37BF",
  },
  blue: {
    50: "#F0F9FF",
    200: "#C5EDF8",
    300: "#86DDF3",
    400: "#24BDE0",
    500: "#0A9FC0",
    600: "#007F9E",
  },
  orange: {
    50: "#FFF6ED",
    200: "#FDDCAB",
    300: "#FEB273",
    400: "#F58C4B",
    500: "#C74E0B",
    600: "#9C3B21",
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
  black: "#0E1114",
};

export const theme = createTheme({
  palette: {
    primary: {
      //    light: "",
      main: customColors.purple["500"],
      //    dark: "",
      //    contrastText: ""
    },
    ...customColors,
  },
  typography: {
    fontFamily: "Inter",
    bpTitle: {
      fontFamily: "Apercu Pro",
      fontSize: 68.66,
      lineHeight: 1,
      fontWeight: 700,
    },
    bpHeading1: {
      fontFamily: "Apercu Pro",
      fontSize: 54.93,
      lineHeight: 1.1,
      fontWeight: 700,
    },
    bpHeading2: {
      fontFamily: "Apercu Pro",
      fontSize: 43.95,
      lineHeight: 1.2,
    },
    bpHeading3: {
      fontFamily: "Apercu Pro",
      fontSize: 28.13,
      lineHeight: 1.1,
    },
    bpSmallCaps: {
      fontFamily: "Apercu Pro",
      fontSize: 15,
      lineHeight: 1.3,
    },
    bpLargeText: {
      fontSize: 22.5,
      lineHeight: 1.1,
    },
    bpBodyCopy: {
      fontSize: 18,
      fontWeight: 400,
      lineHeight: 1.7,
    },
    bpSmallCopy: {
      fontWeight: 500,
      fontSize: 15,
      lineHeight: 1.5,
    },
    bpMicroCopy: {
      fontSize: 14,
      lineHeight: 15.4,
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
  ] as Shadows,
  components: {
    MuiCssBaseline: {
      styleOverrides: `
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
                font-family: 'Apercu Pro';
                font-weight: 400;
                src: url(${ApercuProRegular}) format("trueType");
            }
            @font-face {
                font-family: 'Apercu Pro';
                font-weight: 700;
                src: url(${ApercuProBold}) format("trueType");
            }
          `,
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
      // styleOverrides: {
      //   root: {},

      //   contained: {
      //   },
      // },
    },
    // MuiContainer: {
    //   styleOverrides: {

    //   }
    // }
    MuiIcon: {
      defaultProps: {
        baseClassName: "fas",
      },
    },
  },
});
