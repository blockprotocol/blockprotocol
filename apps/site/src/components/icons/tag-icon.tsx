import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const TagIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      {...props}
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 4C2.5 3.46875 2.9375 3 3.5 3C4.03125 3 4.5 3.46875 4.5 4C4.5 4.5625 4.03125 5 3.5 5C2.9375 5 2.5 4.5625 2.5 4ZM6.15625 0.5C6.6875 0.5 7.1875 0.71875 7.5625 1.09375L13.0625 6.59375C13.8438 7.375 13.8438 8.65625 13.0625 9.4375L8.90625 13.5938C8.125 14.375 6.84375 14.375 6.0625 13.5938L0.5625 8.09375C0.1875 7.71875 0 7.21875 0 6.6875V2C0 1.1875 0.65625 0.5 1.5 0.5H6.15625ZM1.625 7.03125L7.125 12.5312C7.3125 12.75 7.65625 12.75 7.84375 12.5312L12 8.375C12.2188 8.1875 12.2188 7.84375 12 7.65625L6.5 2.15625C6.40625 2.0625 6.28125 2 6.15625 2H1.5V6.6875C1.5 6.8125 1.53125 6.9375 1.625 7.03125Z"
        fill="url(#paint0_linear_4752_31355)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4752_31355"
          x1="-3"
          y1="11.875"
          x2="15.2762"
          y2="14.8402"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.261406" stopColor="#6834FB" />
          <stop offset="1" stopColor="#FF45EC" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};
