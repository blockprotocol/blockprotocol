import { ButtonProps, SxProps } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { Button } from "../../button";
import { ArrowRightIcon } from "../../icons";

export interface BtnProps {
  buttonLabel: ReactNode;
  loading?: boolean;
  color?: string;
  backgroundColor?: string;
  sx?: SxProps;
  endIcon?: ReactNode;
}

export const CustomButton: FunctionComponent<
  Partial<Omit<ButtonProps, "color">> & BtnProps
> = ({
  buttonLabel,
  loading,
  backgroundColor,
  color,
  sx,
  endIcon,
  ...props
}) => {
  const defaultBackgroundTransitionStyles = {
    background: "#D8D6FE",
    transition: "none",
    webkitTransition: "none",
    backgroundColor: "#D8D6FE",
  };
  const sxWithbackgroundTransitionStyles =
    backgroundColor === "#FFFFFF" || backgroundColor === "#F4F3FF"
      ? {
          ...sx,
          transition: "none",
          webkitTransition: "none",
          "&:before": defaultBackgroundTransitionStyles,
          "&:after": defaultBackgroundTransitionStyles,
        }
      : { ...sx };
  return (
    <Button
      {...props}
      disabled={loading}
      loading={loading}
      sx={(theme) => ({
        zIndex: 1,
        whiteSpace: "nowrap",
        minWidth: "unset",
        height: 1,
        backgroundColor,
        color,
        fontSize: 15,
        [theme.breakpoints.down("sm")]: {
          px: 2.5,
        },
        "&.Mui-disabled": {
          borderColor: "#DDE7F0 !important",
        },
        ...sxWithbackgroundTransitionStyles,
      })}
      endIcon={
        endIcon || (
          <ArrowRightIcon
            sx={{
              color: ({ palette }) =>
                `${color || palette.common.white} !important`,
            }}
          />
        )
      }
    >
      {buttonLabel}
    </Button>
  );
};
