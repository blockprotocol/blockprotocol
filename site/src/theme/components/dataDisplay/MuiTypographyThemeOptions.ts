import { Components } from "@mui/material";
import { customColors } from "../../palette";
import { defaultTheme } from "../../util";

export const MuiTypographyThemeOptions: Components["MuiTypography"] = {
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
  styleOverrides: {
    root: ({ ownerState }) => ({
      "& a": {
        ...(ownerState.variant === "bpBodyCopy" && {
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
        }),
        ...(ownerState.variant === "bpSmallCopy" && {
          color: "currentColor",
          borderBottomWidth: 2,
          borderBottomColor: "currentColor",
          borderBottomStyle: "solid",
          transition: defaultTheme.transitions.create("color"),
          ":hover": {
            color: customColors.purple[700],
            borderBottomColor: customColors.purple[700],
          },
        }),
      },
    }),
  },
};
