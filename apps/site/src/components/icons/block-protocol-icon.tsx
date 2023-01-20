import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const BlockProtocolIcon: FunctionComponent<
  SvgIconProps & { gradient?: boolean }
> = ({ gradient = false, sx = [], ...remainingProps }) => {
  return (
    <SvgIcon
      {...remainingProps}
      sx={[{ width: "unset" }, ...(Array.isArray(sx) ? sx : [sx])]}
      width="32"
      height="49"
      viewBox="0 0 32 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.8028 10.1H9.81689V5.98571C9.81689 4.53081 9.25598 3.13551 8.25755 2.10673C7.25911 1.07796 5.90495 0.5 4.49295 0.5H0.5V43.0143C0.5 44.4692 1.06091 45.8645 2.05934 46.8933C3.05777 47.922 4.41194 48.5 5.82394 48.5H9.81689V38.9H17.8028C21.4153 38.7592 24.8342 37.1816 27.3417 34.4984C29.8492 31.8152 31.25 28.2352 31.25 24.5103C31.25 20.7854 29.8492 17.2054 27.3417 14.5222C24.8342 11.839 21.4153 10.2613 17.8028 10.1206V10.1ZM17.8028 29.3H9.81689V19.7H17.8028C20.4648 19.7 22.2949 21.8703 22.2949 24.5C22.2949 27.1297 20.4648 29.2897 17.8028 29.2897V29.3Z"
        fill={gradient ? "url(#paint0_linear_4406_29388)" : "currentColor"}
      />

      <defs>
        <linearGradient
          id="paint0_linear_4406_29388"
          x1="15.5004"
          y1="0.5"
          x2="15.5004"
          y2="45.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#523ADF" />
          <stop offset="1" stopColor="#8974FF" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};
