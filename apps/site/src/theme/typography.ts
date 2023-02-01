import { createTheme, ThemeOptions } from "@mui/material";

import { customColors } from "./palette";

const defaultTheme = createTheme();

export const fallbackFonts = [`"Helvetica"`, `"Arial"`, "sans-serif"];

export const HEADING_FONT_FAMILY = `"colfax-web"`;
export const COPY_FONT_FAMILY = `"Inter"`;
export const CODE_FONT_FAMILY = `"JetBrains Mono", Monaco, monospace`;

export const typography: ThemeOptions["typography"] = {
  fontSize: 16,
  bpTitle: {
    fontFamily: [HEADING_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step-6)",
    lineHeight: 1,
    fontWeight: 700,
    color: customColors.gray[90],
  },
  bpSubtitle: {
    fontFamily: [HEADING_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step-3)",
    lineHeight: 1.1,
    fontWeight: 200,
    color: customColors.gray[90],
  },
  bpHeading1: {
    fontFamily: [HEADING_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step-5)",
    lineHeight: 1.1,
    fontWeight: 700,
    color: customColors.gray[90],
  },
  bpHeading2: {
    fontFamily: [HEADING_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step-4)",
    lineHeight: 1.2,
    color: customColors.gray[90],
  },
  bpHeading3: {
    fontFamily: [HEADING_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step-3)",
    lineHeight: 1.1,
    color: customColors.gray[80],
  },
  bpHeading4: {
    fontFamily: [HEADING_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step-2)",
    lineHeight: 1.1,
    color: customColors.gray[80],
  },
  bpHeading5: {
    fontFamily: [HEADING_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step-1)",
    lineHeight: 1.1,
    color: customColors.gray[80],
  },
  bpSmallCaps: {
    fontFamily: [HEADING_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step--1)",
    lineHeight: 1.3,
    color: customColors.gray[80],
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  bpLargeText: {
    fontFamily: [COPY_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step-1)",
    lineHeight: 1.1,
    color: customColors.gray[90],
  },
  bpBodyCopy: {
    fontFamily: [COPY_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontSize: "var(--step-0)",
    fontWeight: 400,
    lineHeight: 1.7,
    color: customColors.gray[90],
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
    fontFamily: [COPY_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontWeight: 500,
    fontSize: "var(--step--1)",
    lineHeight: 1.5,
    color: customColors.gray[90],
  },
  bpMicroCopy: {
    fontFamily: [COPY_FONT_FAMILY, ...fallbackFonts].join(", "),
    fontWeight: 500,
    fontSize: "var(--step--2)",
    lineHeight: 1.1,
    color: customColors.gray[90],
  },
  bpCode: {
    fontFamily: CODE_FONT_FAMILY,
    fontSize: "var(--step--2)",
    lineHeight: 1.5,
    color: customColors.gray[80],
    background: customColors.purple[20],
    border: `1px solid ${customColors.purple[30]}`,
    borderRadius: defaultTheme.shape.borderRadius,
    padding: defaultTheme.spacing(0.25, 0.5),
  },
};
