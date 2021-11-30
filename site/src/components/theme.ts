import { colors, createTheme } from "@mui/material";

import InterMedium from "../assets/fonts/Inter-Medium.ttf";
import InterRegular from "../assets/fonts/Inter-Regular.ttf";
import ApercuProRegular from "../assets/fonts/apercu-regular-pro.ttf";
import ApercuProBold from "../assets/fonts/Apercu-bold-pro.ttf";

// @todo figure out how to override material colors to work with ours
const customColors = {
  ...colors,
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
    // 100: "#D9D6FE",
    200: "#C5EDF8",
    300: "#86DDF3",
    400: "#24BDE0",
    500: "#0A9FC0",
    600: "#007F9E",
  },
  orange: {
    50: "#007F9E",
    200: "#FDDCAB",
    300: "#FEB273",
    400: "#F58C4B",
    500: "#C74E0B",
    600: "#9C3B21",
  },
  gray: {

  },
};

export const theme = createTheme({
  palette: {
    primary: {
      //    light: "",
      main: customColors.purple["500"],
      //    dark: "",
      //    contrastText: ""
    },
    ...customColors
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
  // shadows: {

  // },
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
            color: "#F5F6F6", // this should be taken from list of colors
            "&:hover": {
              background: `radial-gradient(57.38% 212.75% at 50.1% 134.31%, ${customColors.blue["400"]} 0%, ${customColors.purple["500"]} 100%)`,
            },
            borderRadius: 34,
            border: "1px solid #6B54EF",
          },
        },
        {
          props: { variant: "secondary" },
          style: {
            background: "#FFFFFF",
            border: `1px solid #6B54EF`,
            color: "#6B54EF", // this should be taken from list of colors
            "&:hover": {
              background: "#CCEBF3",
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
