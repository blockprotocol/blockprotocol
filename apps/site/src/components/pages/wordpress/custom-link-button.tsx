import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@mui/material";

import { FontAwesomeIcon } from "../../icons";
import { LinkButton, LinkButtonProps } from "../../link-button";

export const CustomLinkButton = ({
  endIcon,
  children,
  isPrimary,
  sx,
  ...props
}: { isPrimary?: boolean } & LinkButtonProps) => {
  const theme = useTheme();
  const backgroundColor = isPrimary
    ? theme.palette.purple[700]
    : theme.palette.purple[20];

  const color = isPrimary ? "#FFFFFF" : theme.palette.purple[90];

  return (
    <LinkButton
      {...props}
      size="small"
      sx={{
        ...sx,
        color,
        backgroundColor,
        fontSize: "14px",
        padding: "8px 18px 8px 18px",
        "&:before": {
          border: "none",
        },
      }}
      endIcon={endIcon || <FontAwesomeIcon icon={faArrowRight} />}
    >
      {children}
    </LinkButton>
  );
};
