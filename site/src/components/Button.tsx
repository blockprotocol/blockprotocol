import {
  Box,
  // eslint-disable-next-line no-restricted-imports
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { FC } from "react";

// inspired by https://github.com/loadingio/css-spinner/blob/master/src/ellipsis/index.styl
const loadingAnimation = (
  <Box
    sx={{
      display: "inline-block",
      position: "relative",
      width: 80,
      height: 13,
      "> div": {
        position: "absolute",
        top: 0,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "currentColor",
        animationTimingFunction: "cubic-bezier(0, 1, 1, 0)",
        "&:nth-child(1)": {
          left: 8,
          animation: "lds-ellipsis1 0.6s infinite",
        },
        "&:nth-child(2)": {
          left: 8,
          animation: "lds-ellipsis2 0.6s infinite",
        },
        "&:nth-child(3)": {
          left: 32,
          animation: "lds-ellipsis2 0.6s infinite",
        },
        "&:nth-child(4)": {
          left: 56,
          animation: "lds-ellipsis3 0.6s infinite",
        },
      },
      "@keyframes lds-ellipsis1": {
        "0%": {
          transform: "scale(0)",
        },
        "100%": {
          transform: "scale(1)",
        },
      },
      "@keyframes lds-ellipsis3": {
        "0%": {
          transform: "scale(1)",
        },
        "100%": {
          transform: "scale(0)",
        },
      },
      "@keyframes lds-ellipsis2": {
        "0%": {
          transform: "translate(0, 0)",
        },
        "100%": {
          transform: "translate(24px, 0)",
        },
      },
    }}
  >
    <div />
    <div />
    <div />
    <div />
  </Box>
);

type ButtonProps = {
  squared?: boolean;
  loading?: boolean;
} & MuiButtonProps;

// probably rename to BPButton?
// @todo implement loading
export const Button: FC<ButtonProps> = ({
  children,
  squared,
  loading,
  ...props
}) => {
  return (
    <MuiButton
      {...props}
      sx={{
        borderRadius: squared ? "6px" : undefined,
        /** @todo: figure out how to properly merge this object with `props.sx` */
        ...props.sx,
        lineHeight: "1.5",
      }}
    >
      {loading ? loadingAnimation : children}
    </MuiButton>
  );
};
