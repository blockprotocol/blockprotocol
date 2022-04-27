import { Paper, PaperProps, Typography } from "@mui/material";
import {
  Children,
  isValidElement,
  ReactElement,
  ReactFragment,
  ReactNode,
  ReactPortal,
  VoidFunctionComponent,
} from "react";

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
  title: ReactNode;
  children?: ReactNode;
  sx?: PaperProps["sx"];
};

export const InfoCard: VoidFunctionComponent<InfoCardProps> = ({
  variant = "info",
  title,
  children,
  sx,
}) => {
  const paperVariant = mapInfoCardVariantToPaperVariant(variant);

  const ensureChildIsWrappedInTypography = (
    child: ReactElement | ReactFragment | ReactPortal,
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
        {isValidElement(child) ? child.props.children : child}
      </Typography>
    );
  };

  return (
    <Paper
      variant={paperVariant}
      sx={{
        marginBottom: 3,
        padding: {
          xs: 2,
          sm: 3,
        },
        ...sx,
      }}
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
      {Children.toArray(children).map(ensureChildIsWrappedInTypography)}
    </Paper>
  );
};
