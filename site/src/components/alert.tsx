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
  AlertColor,
  AlertProps as MuiAlertProps,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";

import { FontAwesomeIcon } from "./icons";

const icons: Record<AlertColor, IconDefinition> = {
  error: faXmarkCircle,
  info: faInfoCircle,
  success: faCheckCircle,
  warning: faExclamationCircle,
};

interface AlertProps {
  title?: string;
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
  sx,
}: AlertProps) => {
  const { palette } = useTheme();

  const icon = icons[type];

  return (
    <MuiAlert icon={<FontAwesomeIcon icon={icon} />} severity={type} sx={sx}>
      <Box flexGrow={1}>
        {!!title && (
          <Typography
            variant="bpSmallCaps"
            fontWeight={500}
            mb={1.5}
            color={palette.gray[90]}
          >
            {title}
          </Typography>
        )}
        <Typography variant="bpSmallCopy" color={palette.gray[80]}>
          {description}
        </Typography>
      </Box>

      {extraContent}
    </MuiAlert>
  );
};
