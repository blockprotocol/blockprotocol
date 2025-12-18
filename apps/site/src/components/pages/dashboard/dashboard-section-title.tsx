import { Typography, TypographyProps } from "@mui/material";

export const DashboardSectionTitle = ({
  children,
  ...props
}: TypographyProps) => {
  return (
    <Typography
      variant="bpSmallCaps"
      maxWidth={750}
      fontWeight={500}
      pt={2.25}
      sx={{ color: "gray.70" }}
      {...props}
    >
      {children}
    </Typography>
  );
};
