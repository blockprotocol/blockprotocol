import { buttonClasses, useTheme } from "@mui/material";

import { LinkButton, LinkButtonProps } from "../../link-button";

export const CustomLinkButton = ({
  pink,
  disabled,
  children,
  sx,
  ...props
}: { pink?: boolean } & LinkButtonProps) => {
  const theme = useTheme();
  const backgroundColor = pink
    ? theme.palette.pink[70]
    : theme.palette.purple[90];

  return (
    <LinkButton
      {...props}
      size="small"
      variant={disabled ? "tertiary" : "primary"}
      disabled={disabled}
      sx={[
        ({ palette }) => ({
          fontWeight: 500,
          color: palette.common.white,
          background: backgroundColor,
          padding: "8px 20px",
          "&::before": {
            background: `radial-gradient(171.94% 187.5% at 50.28% 0%, ${
              pink ? theme.palette.pink[50] : theme.palette.purple[70]
            }80 0%, ${
              pink ? theme.palette.pink[60] : theme.palette.purple[80]
            }80 100%), ${backgroundColor}`,
          },
          [`&.${buttonClasses.disabled}`]: {
            color: palette.gray[50],
            background: palette.gray[10],
            "&::before": {
              borderColor: palette.gray[30],
              background: "none",
            },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </LinkButton>
  );
};
