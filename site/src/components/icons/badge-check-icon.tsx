import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const BadgeCheckIcon: FunctionComponent<SvgIconProps> = (props) => {
  const { sx = [], ...otherProps } = props;
  return (
    <SvgIcon
      {...otherProps}
      sx={[
        {
          width: "1em",
          height: "1em",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      viewBox="0 0 60 60"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.2654 6.37794L30.1888 2L23.1122 6.37794L14.7921 6.52089L11.2057 14.0297L4.28369 18.6482L5.32627 26.904L2 34.5316L7.34049 40.9131L8.66605 49.1282L16.6089 51.6094L22.1654 57.8037L30.1888 55.5968L38.2121 57.8037L43.7687 51.6094L51.7115 49.1282L53.0371 40.9131L58.3776 34.5316L55.0513 26.904L56.0939 18.6482L49.1718 14.0297L45.5855 6.52089L37.2654 6.37794ZM41.0568 25.1639C42.0532 24.077 41.9797 22.3881 40.8928 21.3917C39.8058 20.3953 38.1169 20.4688 37.1206 21.5557L25.7733 33.9346L21.2003 30.193C20.059 29.2593 18.377 29.4275 17.4432 30.5687C16.5095 31.7099 16.6777 33.392 17.8189 34.3258L26.2986 41.2637L41.0568 25.1639Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
