import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

interface HashIconProps {
  dark?: boolean;
}

export const HashIcon: FunctionComponent<SvgIconProps & HashIconProps> = ({
  dark = false,
  ...props
}) => {
  return (
    <SvgIcon {...props} width="89" height="88" viewBox="0 0 89 88">
      <g opacity="0.9">
        <path
          opacity="0.886277"
          d="M50.0879 88H74.5902V0H50.0879V88Z"
          fill={dark ? "inherit" : "url(#paint0_linear_4410_29421)"}
        />
        <path
          opacity="0.898345"
          d="M14.9092 88H39.4096V0H14.9092V88Z"
          fill={dark ? "inherit" : "url(#paint1_linear_4410_29421)"}
        />
        <path
          opacity="0.881278"
          d="M0.75 37.7174H88.75V13.2151H0.75V37.7174Z"
          fill={dark ? "inherit" : "url(#paint2_linear_4410_29421)"}
        />
        <path
          opacity="0.855632"
          d="M0.75 73.5259H88.75V49.0254H0.75V73.5259Z"
          fill={dark ? "inherit" : "url(#paint3_linear_4410_29421)"}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_4410_29421"
          x1="74.5902"
          y1="88"
          x2="74.5902"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FFB2" />
          <stop offset="1" stopColor="#0085FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_4410_29421"
          x1="14.9092"
          y1="0"
          x2="14.9092"
          y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#FFB800" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_4410_29421"
          x1="5.90363"
          y1="36.5009"
          x2="85.1649"
          y2="36.5009"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FB24FF" />
          <stop offset="1" stopColor="#0075FF" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_4410_29421"
          x1="8.49678"
          y1="72.4475"
          x2="88.75"
          y2="72.4475"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F6CA2B" />
          <stop offset="1" stopColor="#06E41C" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};
