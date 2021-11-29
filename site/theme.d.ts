declare module "@mui/material/styles" {
  interface TypographyVariants {
    bpTitle: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    bpTitle?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bpTitle: true;
  }
}
