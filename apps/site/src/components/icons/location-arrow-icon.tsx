import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const LocationArrowIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      {...props}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.46875 7C1 7 0.59375 6.6875 0.5 6.21875C0.40625 5.75 0.65625 5.28125 1.09375 5.09375L12.0938 0.59375C12.4688 0.4375 12.9062 0.53125 13.1875 0.8125C13.4688 1.09375 13.5625 1.53125 13.4062 1.90625L8.90625 12.9062C8.71875 13.3438 8.25 13.5938 7.78125 13.5C7.3125 13.4062 6.96875 13 6.96875 12.5V7H1.46875ZM8.5 5.5V9.96875L11.5625 2.4375L4.03125 5.5H8.5Z"
        fill="url(#paint0_linear_4752_31310)"
      />
      <path
        d="M1.46875 7C1 7 0.59375 6.6875 0.5 6.21875C0.40625 5.75 0.65625 5.28125 1.09375 5.09375L12.0938 0.59375C12.4688 0.4375 12.9062 0.53125 13.1875 0.8125C13.4688 1.09375 13.5625 1.53125 13.4062 1.90625L8.90625 12.9062C8.71875 13.3438 8.25 13.5938 7.78125 13.5C7.3125 13.4062 6.96875 13 6.96875 12.5V7H1.46875ZM8.5 5.5V9.96875L11.5625 2.4375L4.03125 5.5H8.5Z"
        fill="white"
        fillOpacity="0.3"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4752_31310"
          x1="-3"
          y1="11.375"
          x2="15.2762"
          y2="14.3402"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.261406" stopColor="#6834FB" />
          <stop offset="1" stopColor="#FF45EC" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};
