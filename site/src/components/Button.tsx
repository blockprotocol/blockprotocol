import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { FC } from "react";

type ButtonProps = {
  loading?: boolean;
} & MuiButtonProps;

// probably rename to BPButton?
// @todo implement loading
export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  ...props
}) => {
  return (
    <MuiButton {...props} variant={variant}>
      {children}
    </MuiButton>
  );
};
