import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const EnvelopeDotIcon: FunctionComponent<SvgIconProps> = (props) => {
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
        d="M51.9117 21.1765C55.5503 21.1765 58.5 18.2269 58.5 14.5883C58.5 10.9497 55.5503 8 51.9117 8C48.2731 8 45.3234 10.9497 45.3234 14.5883C45.3234 18.2269 48.2731 21.1765 51.9117 21.1765ZM6.5 11.2947H42.5917C42.2276 12.325 42.0295 13.4336 42.0295 14.5885C42.0295 18.7899 44.6513 22.379 48.3482 23.8088L31.7181 36.7433C30.0329 38.054 27.6731 38.054 25.9879 36.7433L2.5 18.4749V15.2948C2.5 13.0856 4.29086 11.2947 6.5 11.2947ZM33.6281 39.1991L52.5942 24.4477C53.5042 24.3856 54.3803 24.2004 55.2061 23.9085V46.8243C55.2061 49.0335 53.4153 50.8243 51.2061 50.8243H6.50001C4.29087 50.8243 2.5 49.0335 2.5 46.8243V22.4163L24.0779 39.1991C26.8866 41.3836 30.8195 41.3836 33.6281 39.1991Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
