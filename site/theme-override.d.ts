declare module "@mui/material/styles" {
  interface Palette {
    purple: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
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
    grey: undefined;
  }

  interface TypographyVariants {
    bpTitle: React.CSSProperties;
    bpHeading1: React.CSSProperties;
    bpHeading2: React.CSSProperties;
    bpHeading3: React.CSSProperties;
    bpLargeText: React.CSSProperties;
    bpBodyCopy: React.CSSProperties;
    bpSmallCopy: React.CSSProperties;
    bpMicroCopy: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    bpTitle?: React.CSSProperties;
    bpHeading1?: React.CSSProperties;
    bpHeading2?: React.CSSProperties;
    bpHeading3?: React.CSSProperties;
    bpSmallCaps?: React.CSSProperties;
    bpLargeText?: React.CSSProperties;
    bpBodyCopy?: React.CSSProperties;
    bpSmallCopy?: React.CSSProperties;
    bpMicroCopy?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bpTitle: true;
    bpHeading1: true;
    bpHeading2: true;
    bpHeading3: true;
    bpSmallCaps: true;
    bpLargeText: true;
    bpBodyCopy: true;
    bpSmallCopy: true;
    bpMicroCopy: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
  }
}

// https://github.com/mui-org/material-ui/issues/28244
export default "";
