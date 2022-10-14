import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const ArrowUpCircleIcon: FunctionComponent<SvgIconProps> = (props) => {
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
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.8125 10C17.8125 14.0386 14.5386 17.3125 10.5 17.3125C6.46142 17.3125 3.1875 14.0386 3.1875 10C3.1875 5.96142 6.46142 2.6875 10.5 2.6875C14.5386 2.6875 17.8125 5.96142 17.8125 10ZM19.5 10C19.5 14.9706 15.4706 19 10.5 19C5.52944 19 1.5 14.9706 1.5 10C1.5 5.02944 5.52944 1 10.5 1C15.4706 1 19.5 5.02944 19.5 10ZM10.5 4.30713L14.4716 8.27875C14.8011 8.60826 14.8011 9.14249 14.4716 9.47199C14.1421 9.8015 13.6079 9.8015 13.2784 9.47199L11.3438 7.53736V14.5002C11.3438 14.9662 10.966 15.344 10.5 15.344C10.034 15.344 9.65625 14.9662 9.65625 14.5002V7.53736L7.72162 9.47199C7.39212 9.8015 6.85788 9.8015 6.52838 9.47199C6.19887 9.14249 6.19887 8.60826 6.52838 8.27875L10.5 4.30713Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
