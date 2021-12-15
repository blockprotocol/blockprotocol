import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { FC } from "react";

type ButtonProps = {
  squared?: boolean;
  loading?: boolean;
} & MuiButtonProps;

// probably rename to BPButton?
// @todo implement loading
export const Button: FC<ButtonProps> = ({ children, squared, ...props }) => {
  return (
    <MuiButton
      {...props}
      sx={{
        borderRadius: squared ? "6px" : undefined,
        ...props.sx,
      }}
    >
      {children}
    </MuiButton>
  );
};
