import { VFC, ReactNode } from "react";
import { Paper, PaperProps, Typography } from "@mui/material";

export type InfoCardVariant = "info" | "warning";

const mapInfoCardVariantToPaperVariant = (
  infoCardVariant: InfoCardVariant,
): "purple" | "teal" => {
  if (infoCardVariant === "warning") {
    return "purple";
  }
  return "teal";
};

type InfoCardProps = {
  variant?: "info" | "warning";
  title: ReactNode;
  content: ReactNode;
  sx?: PaperProps["sx"];
};

export const InfoCard: VFC<InfoCardProps> = ({
  variant = "info",
  title,
  content,
  sx,
}) => {
  const paperVariant = mapInfoCardVariantToPaperVariant(variant);
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
        marginBottom={1}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: ({ palette }) => palette[paperVariant][600],
          fontSize: 15,
          lineHeight: 1.75,
        }}
      >
        {content}
      </Typography>
    </Paper>
  );
};
