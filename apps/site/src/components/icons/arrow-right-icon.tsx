import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const ArrowRightIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M10.8028 5.2472L11.5956 4.45443C11.9313 4.11875 12.4741 4.11875 12.8062 4.45443L19.7482 11.3929C20.0839 11.7286 20.0839 12.2714 19.7482 12.6035L12.8062 19.5456C12.4705 19.8813 11.9277 19.8813 11.5956 19.5456L10.8028 18.7528C10.4636 18.4136 10.4707 17.8601 10.8171 17.528L15.1202 13.4284L4.85705 13.4284C4.3821 13.4284 4 13.0463 4 12.5714L4 11.4287C4 10.9537 4.3821 10.5716 4.85705 10.5716L15.1202 10.5716L10.8171 6.47206C10.4671 6.13996 10.46 5.58645 10.8028 5.2472Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
