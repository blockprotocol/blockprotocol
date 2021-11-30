import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { FC } from "react";



type ButtonProps = {} & MuiButtonProps;

// probably rename to BPButton?
// do we have to explicitly make this a component
export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return <MuiButton {...props}>{children}</MuiButton>;
};