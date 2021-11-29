import { colors, createTheme } from "@mui/material";

import InterMedium from "../../assets/fonts/Inter-Medium.ttf";
import InterRegular from "../../assets/fonts/Inter-Regular.ttf";
import ApercuProRegular from "../../assets/fonts/ApercuPro-Regular.ttf";
import ApercuProBold from "../../assets/fonts/ApercuPro-Bold.ttf";

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
};

export const theme = createTheme({
  //   palette: {
  //     primary: {
  //       //    light: "",
  //       main: customColors.purple["500"],
  //       //    dark: "",
  //       //    contrastText: ""
  //     },
  //     secondary: {},
  //   },
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
    bpLargeText: {},
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
  },
});
