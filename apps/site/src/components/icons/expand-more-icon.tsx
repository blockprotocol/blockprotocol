import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const ExpandMoreIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      {...props}
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      sx={{ scale: "0.6 !important" }}
    >
      <path
        d="M6.6875 6.71875C7.09375 6.34375 7.09375 5.6875 6.6875 5.3125L2.6875 1.3125C2.40625 1.03125 1.96875 0.9375 1.59375 1.09375C1.21875 1.25 0.96875 1.59375 0.96875 2V10C0.96875 10.4062 1.21875 10.7812 1.59375 10.9375C1.96875 11.0938 2.40625 11 2.6875 10.7188L6.6875 6.71875Z"
        fill="#C1CFDE"
      />
    </SvgIcon>
  );
};
