import { ThemeOptions } from "@mui/material";

export const customColors = {
  purple: {
    10: "#F7F8FF",
    20: "#EFEBFE",
    30: "#E4DDFD",
    40: "#C6B7FA",
    50: "#A690F4",
    60: "#8D68F8",
    70: "#7556DC",
    80: "#5532C3",
    90: "#4625AA",
    /**
     * We'll switch to 10-100 instead of 100-1000 color palette
     * @todo add `100: "#3A2084"` when swapped the current 100's in the app with 10,
     * when all purples below are swapped with above in the code, remove the purples below */
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
  green: {
    10: "#FAFDF0",
    20: "#F8FDD5",
    30: "#EEF8AB",
    40: "#DCEF87",
    50: "#BDE170",
    60: "#9AC952",
    70: "#78B040",
    80: "#42802C",
    90: "#334D0B",
    100: "#243804",
  },
  // should adjust to be consistent with the ones above
  gray: {
    10: "#F7FAFC",
    20: "#EBF2F7",
    30: "#DDE7F0",
    40: "#C1CFDE",
    50: "#91A5BA",
    60: "#758AA1",
    70: "#64778C",
    80: "#4D5C6C",
    90: "#37434e",
  },
  black: "#0E1114",
  white: "#FFFFFF",
} as const;

export const palette: ThemeOptions["palette"] = {
  ...customColors,
  primary: {
    main: customColors.purple[600],
  },
};
