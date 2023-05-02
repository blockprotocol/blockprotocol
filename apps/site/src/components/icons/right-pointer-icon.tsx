import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const RightPointerIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      {...props}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      sx={{ scale: "0.7 !important" }}
    >
      <path
        d="M13.75 7.5625C13.9062 7.40625 14 7.21875 14 7C14 6.8125 13.9062 6.625 13.75 6.46875L8.25 1.21875C7.96875 0.9375 7.46875 0.9375 7.1875 1.25C6.90625 1.53125 6.90625 2.03125 7.21875 2.3125L11.375 6.25H0.75C0.3125 6.25 0 6.59375 0 7C0 7.4375 0.3125 7.75 0.75 7.75H11.375L7.21875 11.7188C6.90625 12 6.90625 12.4688 7.1875 12.7812C7.46875 13.0938 7.9375 13.0938 8.25 12.8125L13.75 7.5625Z"
        fill="#91A5BA"
      />
    </SvgIcon>
  );
};
