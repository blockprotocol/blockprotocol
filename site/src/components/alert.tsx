import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faXmarkCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  // eslint-disable-next-line no-restricted-imports
  Alert as MuiAlert,
  alertClasses,
  AlertColor,
  AlertProps as MuiAlertProps,
  Box,
  Palette,
  Typography,
  useTheme,
} from "@mui/material";
import { ReactNode, useMemo } from "react";

import { FontAwesomeIcon } from "./icons";

const getTypeProps = (
  palette: Palette,
): Record<
  AlertColor,
  {
    icon: IconDefinition;
    colors: {
      icon: string;
      border: string;
      bg: string;
      codeBg: string;
      codeBorder: string;
    };
  }
> => ({
  error: {
    icon: faXmarkCircle,
    colors: {
      icon: palette.red[600],
      bg: palette.red[100],
      border: palette.red[300],
      codeBg: palette.red[200],
      codeBorder: palette.red[300],
    },
  },
  info: {
    icon: faInfoCircle,
    colors: {
      icon: palette.purple[200],
      bg: palette.purple[100],
      border: palette.purple[300],
      codeBg: palette.purple[20],
      codeBorder: palette.purple[30],
    },
  },
  success: {
    icon: faCheckCircle,
    colors: {
      icon: palette.green[60],
      bg: palette.green[10],
      border: palette.green[30],
      codeBg: palette.green[20],
      codeBorder: palette.green[40],
    },
  },
  warning: {
    icon: faExclamationCircle,
    colors: {
      icon: palette.orange[300],
      bg: palette.orange[100],
      border: palette.orange[300],
      codeBg: palette.orange[200],
      codeBorder: palette.orange[300],
    },
  },
});

interface AlertProps {
  title: string;
  description: ReactNode;
  type?: AlertColor;
  extraContent?: ReactNode;
  sx?: MuiAlertProps["sx"];
}

export const Alert = ({
  title,
  description,
  type = "info",
  extraContent,
  sx = [],
}: AlertProps) => {
  const { palette, spacing } = useTheme();

  const typeProps = useMemo(() => getTypeProps(palette)[type], [type, palette]);
  const { icon, colors } = typeProps;

  return (
    <MuiAlert
      icon={<FontAwesomeIcon icon={icon} />}
      severity={type}
      sx={[
        {
          border: `1px solid ${colors.border}`,
          width: "100%",
          alignItems: "center",
          padding: spacing(3, 4),
          background: colors.bg,

          [`.${alertClasses.icon}`]: {
            marginRight: spacing(3),
            svg: {
              color: colors.icon,
              fontSize: spacing(4),
            },
          },

          [`.${alertClasses.message}`]: {
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            overflow: "visible",
            padding: 0,
          },

          code: {
            background: colors.codeBg,
            borderColor: colors.codeBorder,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box flexGrow={1}>
        <Typography
          variant="bpSmallCaps"
          fontWeight={500}
          mb={1.5}
          color={palette.gray[90]}
        >
          {title}
        </Typography>
        <Typography variant="bpSmallCopy" color={palette.gray[80]}>
          {description}
        </Typography>
      </Box>

      {extraContent}
    </MuiAlert>
  );
};
