import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const HubIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="20" height="20" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 2C2.89543 2 2 2.89543 2 4V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V4C18 2.89543 17.1046 2 16 2H4ZM11.2629 6.9512L10 5L8.73714 6.9512L6.46447 6.46447L6.9512 8.73714L5 10L6.9512 11.2629L6.46447 13.5355L8.73714 13.0488L10 15L11.2629 13.0488L13.5355 13.5355L13.0488 11.2629L15 10L13.0488 8.73714L13.5355 6.46447L11.2629 6.9512Z"
      />
    </SvgIcon>
  );
};
