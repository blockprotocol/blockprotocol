import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const UpIcon: FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="16" height="16" viewBox="0 0 14 14">
      <path
        d="M12.4062 6.40625C12.25 6.78125 11.875 7 11.5 7H8.5V13C8.5 13.5625 8.03125 14 7.5 14H5.5C4.9375 14 4.5 13.5625 4.5 13V7H1.5C1.09375 7 0.71875 6.78125 0.5625 6.40625C0.40625 6.03125 0.5 5.59375 0.78125 5.3125L5.75 0.3125C5.96875 0.125 6.21875 0 6.5 0C6.75 0 7 0.125 7.1875 0.3125L12.1875 5.3125C12.4688 5.59375 12.5625 6.03125 12.4062 6.40625Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
