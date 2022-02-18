import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const EnvelopeDotIcon: FC<SvgIconProps> = (props) => {
  const { sx, ...otherProps } = props;
  return (
    <SvgIcon
      {...otherProps}
      sx={{
        width: "1em",
        height: "1em",
        ...sx,
      }}
      viewBox="0 0 51 48"
    >
      <path
        d="M45 0C41.625 0 39 2.71875 39 6C39 9.375 41.625 12 45 12C48.2812 12 51 9.375 51 6C51 2.71875 48.2812 0 45 0ZM1.5 13.6875L21.375 29.1562C22.875 30.2812 25.0312 30.2812 26.5312 29.1562L44.7188 15C39.8438 14.9062 36 10.9688 36 6H4.5C1.96875 6 0 8.0625 0 10.5C0 11.7188 0.5625 12.9375 1.5 13.6875ZM24 33C22.4062 33 20.8125 32.5312 19.5 31.5L0 16.3125V37.5C0 40.0312 1.96875 42 4.5 42H43.5C45.9375 42 48 40.0312 48 37.5V16.3125L28.4062 31.5C27.0938 32.5312 25.5 33 24 33Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
