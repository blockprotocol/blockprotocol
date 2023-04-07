import {
  Box,
  // eslint-disable-next-line no-restricted-imports
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { forwardRef, FunctionComponent } from "react";

// inspired by https://github.com/loadingio/css-spinner/blob/master/src/ellipsis/index.styl
const loadingAnimation = (
  <Box
    className="bp-btn-loading"
    sx={{
      position: "absolute",
      width: 80,
      height: 13,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      "> div": {
        position: "absolute",
        top: 0,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "currentColor",
        animationTimingFunction: "cubic-bezier(0, 1, 1, 0)",
        "&:nth-of-type(1)": {
          left: 8,
          animation: "lds-ellipsis1 0.6s infinite",
        },
        "&:nth-of-type(2)": {
          left: 8,
          animation: "lds-ellipsis2 0.6s infinite",
        },
        "&:nth-of-type(3)": {
          left: 32,
          animation: "lds-ellipsis2 0.6s infinite",
        },
        "&:nth-of-type(4)": {
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

export type ButtonProps = {
  squared?: boolean;
  loading?: boolean;
} & MuiButtonProps & { rel?: string; target?: string }; // MUI button renders <a /> when href is provided, but typings miss rel and target

export const Button: FunctionComponent<ButtonProps> = forwardRef(
  ({ children, squared, loading, disabled, sx = [], ...props }, ref) => {
    return (
      <MuiButton
        {...props}
        disabled={disabled || loading}
        sx={[
          {
            borderRadius: squared ? "6px" : undefined,
            lineHeight: "1.5",
            ...(squared
              ? { ":focus-visible:after": { borderRadius: 3 } }
              : undefined),
          },
          loading && {
            "& > :not(.bp-btn-loading)": {
              opacity: 0,
            },
            color: "transparent !important",
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        ref={ref}
      >
        {children}
        {loading && loadingAnimation}
      </MuiButton>
    );
  },
);
