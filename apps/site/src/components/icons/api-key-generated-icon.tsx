import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const ApiKeyGeneratedIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="24" fill="#D9D6FE" />
      <path
        d="M36.5 20C36.5 20.4219 36.3125 20.7969 36.0312 21.0781L24.0312 33.0781C23.75 33.3594 23.375 33.5 23 33.5C22.5781 33.5 22.2031 33.3594 21.9219 33.0781L15.9219 27.0781C15.6406 26.7969 15.5 26.4219 15.5 26C15.5 25.1562 16.1562 24.5 17 24.5C17.375 24.5 17.75 24.6875 18.0312 24.9688L23 29.8906L33.9219 18.9688C34.2031 18.6875 34.5781 18.5 35 18.5C35.7969 18.5 36.5 19.1562 36.5 20Z"
        fill="#6048E5"
      />
    </SvgIcon>
  );
};
