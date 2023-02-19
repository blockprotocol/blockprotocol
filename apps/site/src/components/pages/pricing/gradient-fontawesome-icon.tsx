import { FunctionComponent } from "react";

import { FontAwesomeIcon, FontAwesomeIconProps } from "../../icons";

export const GradientFontAwesomeIcon: FunctionComponent<
  { light?: boolean } & FontAwesomeIconProps
> = ({ light, sx, ...props }) => (
  <FontAwesomeIcon
    {...props}
    sx={[
      { fill: `url(#gradient${light ? "-light" : ""})` },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <linearGradient
      id="gradient-light"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
      gradientTransform="rotate(96.94deg)"
    >
      <stop offset="30.81%" stopColor="#b39afda5" />
      <stop offset="92.56%" stopColor="#ffa2f6a5" />
    </linearGradient>

    <linearGradient
      id="gradient"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
      gradientTransform="rotate(96.94deg)"
    >
      <stop offset="30.81%" stopColor="#6834FB" />
      <stop offset="92.56%" stopColor="#FF45EC" />
    </linearGradient>
  </FontAwesomeIcon>
);
