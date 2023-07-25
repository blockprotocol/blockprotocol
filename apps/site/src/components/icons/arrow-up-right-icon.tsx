import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const ArrowUpRightIcon: FunctionComponent<
  { fill?: string } & SvgIconProps
> = ({ fill, ...props }) => {
  return (
    <SvgIcon {...props} width="320" height="512" viewBox="0 0 320 512">
      <path
        d="M320 120v240c0 13.25-10.75 24-24 24s-24-10.75-24-24V177.9l-231 231C36.28 413.7 30.14 416 24 416s-12.28-2.344-16.97-7.031c-9.375-9.375-9.375-24.56 0-33.94L238.1 144H56C42.75 144 32 133.3 32 120S42.75 96 56 96h240C309.3 96 320 106.8 320 120z"
        fill={fill ?? "#6F59EC"}
      />
    </SvgIcon>
  );
};
