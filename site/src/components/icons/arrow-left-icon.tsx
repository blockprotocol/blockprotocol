import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const ArrowLeftIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M13.1972 18.7528L12.4044 19.5456C12.0687 19.8812 11.5259 19.8812 11.1938 19.5456L4.25176 12.6071C3.91608 12.2714 3.91608 11.7286 4.25176 11.3965L11.1938 4.45439C11.5295 4.11872 12.0723 4.11872 12.4044 4.45439L13.1972 5.24716C13.5364 5.58641 13.5293 6.13992 13.1829 6.47203L8.87981 10.5716H19.143C19.6179 10.5716 20 10.9537 20 11.4286V12.5713C20 13.0463 19.6179 13.4284 19.143 13.4284H8.87981L13.1829 17.5279C13.5329 17.86 13.54 18.4136 13.1972 18.7528Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
