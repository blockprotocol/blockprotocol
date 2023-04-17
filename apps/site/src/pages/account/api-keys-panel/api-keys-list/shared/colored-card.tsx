import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Box, BoxProps, IconButton, Palette, useTheme } from "@mui/material";
import { ReactNode } from "react";

import { FontAwesomeIcon } from "../../../../../components/icons";

const CloseCardButton = ({
  onClick,
  color,
}: {
  onClick: () => void;
  color: string;
}) => {
  return (
    <IconButton
      data-testid="close-card-button"
      onClick={onClick}
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        "& svg": {
          color,
        },
      }}
    >
      <FontAwesomeIcon icon={faClose} sx={{ fontSize: 16 }} />
    </IconButton>
  );
};

type Color = "purple" | "red";

interface ColoredCardProps {
  onClose?: () => void;
  sx?: BoxProps["sx"];
  children: ReactNode;
  color?: Color;
}

const getColorValues = (
  palette: Palette,
): Record<
  Color,
  {
    backgroundColor: string;
    borderColor: string;
    iconColor: string;
  }
> => ({
  purple: {
    backgroundColor: palette.purple[100],
    borderColor: palette.purple[200],
    iconColor: palette.purple[400],
  },
  red: {
    backgroundColor: palette.red[100],
    borderColor: palette.red[200],
    iconColor: palette.red[400],
  },
});

export const ColoredCard = ({
  sx,
  onClose,
  children,
  color = "purple",
}: ColoredCardProps) => {
  const { palette } = useTheme();
  const { backgroundColor, borderColor, iconColor } =
    getColorValues(palette)[color];

  return (
    <Box
      sx={[
        {
          px: 4,
          py: 2.75,
          border: "1px solid",
          borderColor,
          backgroundColor,
          borderRadius: 2,
          width: "100%",
          position: "relative",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
      {!!onClose && <CloseCardButton onClick={onClose} color={iconColor} />}
    </Box>
  );
};
