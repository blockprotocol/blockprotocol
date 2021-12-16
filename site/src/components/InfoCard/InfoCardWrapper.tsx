import { FC, ReactNode } from "react";
import { Box } from "@mui/material";
import { InfoCard, InfoCardVariant } from "./InfoCard";

type InfoCardWrapperProps = {
  variant?: InfoCardVariant;
  infoCardTitle: ReactNode;
  infoCardContent: ReactNode;
};

export const InfoCardWrapper: FC<InfoCardWrapperProps> = ({
  children,
  variant,
  infoCardTitle,
  infoCardContent,
}) => (
  <Box
    display="flex"
    sx={{
      flexDirection: {
        xs: "column",
        sm: "row",
      },
    }}
  >
    <Box>{children}</Box>
    <Box
      sx={{
        marginLeft: {
          xs: 0,
          sm: 3,
        },
        marginBottom: {
          xs: 2,
          sm: 0,
        },
      }}
    >
      <InfoCard
        variant={variant}
        title={infoCardTitle}
        content={infoCardContent}
        sx={{
          width: {
            sx: "unset",
            sm: 275,
          },
        }}
      />
    </Box>
  </Box>
);
