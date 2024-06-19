import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const PencilSimpleLineIcon: FunctionComponent<SvgIconProps> = (
  props,
) => {
  return (
    <SvgIcon {...props} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M6.75 15.1874H3.375C3.22582 15.1874 3.08275 15.1282 2.97726 15.0227C2.87177 14.9172 2.8125 14.7741 2.8125 14.6249V11.482C2.81225 11.4089 2.8264 11.3366 2.85415 11.269C2.8819 11.2014 2.9227 11.14 2.97422 11.0882L11.4117 2.65072C11.4641 2.59757 11.5265 2.55537 11.5953 2.52656C11.6641 2.49775 11.7379 2.48291 11.8125 2.48291C11.8871 2.48291 11.9609 2.49775 12.0298 2.52656C12.0986 2.55537 12.1609 2.59757 12.2133 2.65072L15.3492 5.78666C15.4024 5.839 15.4446 5.90139 15.4734 5.97019C15.5022 6.039 15.517 6.11284 15.517 6.18744C15.517 6.26203 15.5022 6.33588 15.4734 6.40469C15.4446 6.47349 15.4024 6.53588 15.3492 6.58822L6.75 15.1874Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.1875 15.1875H6.75"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5625 4.5L13.5 8.4375"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
