import { FunctionComponent } from "react";

import {
  FontAwesomeIcon,
  FontAwesomeIconPath,
  FontAwesomeIconProps,
} from "../../icons";

export const GradientFontAwesomeIcon: FunctionComponent<
  { light?: boolean } & FontAwesomeIconProps
> = ({ icon, light, sx, children, ...props }) => {
  const {
    icon: [, , , , svgPathData],
  } = icon;

  return (
    <FontAwesomeIcon
      icon={icon}
      {...props}
      sx={[{ fill: `url(#gradient)` }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {light ? (
        <FontAwesomeIconPath svgPathData={svgPathData} fill="#FFFFFF4D" />
      ) : null}

      {children}
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="30.81%" stopColor="#6834FB" />
          <stop offset="92.56%" stopColor="#FF45EC" />
        </linearGradient>
      </defs>
    </FontAwesomeIcon>
  );
};
