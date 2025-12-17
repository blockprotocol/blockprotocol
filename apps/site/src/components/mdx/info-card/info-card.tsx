import { Paper, PaperProps, Typography } from "@mui/material";
import { Children, FunctionComponent, isValidElement, ReactNode } from "react";

export type InfoCardVariant = "info" | "warning";

type PaperVariant = "purple" | "teal";

const mapInfoCardVariantToPaperVariant = (
  infoCardVariant: InfoCardVariant,
): PaperVariant => {
  if (infoCardVariant === "warning") {
    return "purple";
  }
  return "teal";
};

type InfoCardProps = {
  variant?: "info" | "warning";
  title?: ReactNode;
  children?: ReactNode;
  sx?: PaperProps["sx"];
};

export const InfoCard: FunctionComponent<InfoCardProps> = ({
  variant = "info",
  title,
  children,
  sx = [],
}) => {
  const paperVariant = mapInfoCardVariantToPaperVariant(variant);

  const ensureChildIsWrappedInTypography = (
    child: ReactNode,
    index: number,
  ) => {
    return (
      <Typography
        key={index}
        sx={{
          marginTop: 1,
          color: ({ palette }) => palette[paperVariant][600],
          fontSize: 15,
          lineHeight: 1.5,
          "& a": ({ palette }) => ({
            color: palette[paperVariant][600],
            borderColor: palette[paperVariant][600],
            ":hover": {
              color: palette[paperVariant][700],
              borderColor: palette[paperVariant][700],
            },
            ":focus-visible": {
              outlineColor: palette[paperVariant][600],
            },
          }),
        }}
      >
        {isValidElement(child)
          ? (child.props as { children?: React.ReactNode }).children
          : child}
      </Typography>
    );
  };

  return (
    <Paper
      variant={paperVariant}
      sx={[
        {
          marginBottom: 3,
          padding: {
            xs: 2,
            sm: 3,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        variant="bpLargeText"
        sx={{
          fontWeight: 600,
          color: ({ palette }) => palette[paperVariant][600],
          fontSize: 15,
        }}
      >
        {title}
      </Typography>
      {Children.toArray(children).map((child, index) =>
        ensureChildIsWrappedInTypography(child, index),
      )}
    </Paper>
  );
};
