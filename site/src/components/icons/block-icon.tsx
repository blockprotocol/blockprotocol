import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const BlockIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="28" height="28" viewBox="0 0 28 28">
      <path
        d="M0 4C0 1.8125 1.75 0 4 0H24C26.1875 0 28 1.8125 28 4V24C28 26.25 26.1875 28 24 28H4C1.75 28 0 26.25 0 24V4ZM4.5 3C3.625 3 3 3.6875 3 4.5C3 5.375 3.625 6 4.5 6C5.3125 6 6 5.375 6 4.5C6 3.6875 5.3125 3 4.5 3ZM23.5 6C24.3125 6 25 5.375 25 4.5C25 3.6875 24.3125 3 23.5 3C22.625 3 22 3.6875 22 4.5C22 5.375 22.625 6 23.5 6ZM4.5 22C3.625 22 3 22.6875 3 23.5C3 24.375 3.625 25 4.5 25C5.3125 25 6 24.375 6 23.5C6 22.6875 5.3125 22 4.5 22ZM23.5 25C24.3125 25 25 24.375 25 23.5C25 22.6875 24.3125 22 23.5 22C22.625 22 22 22.6875 22 23.5C22 24.375 22.625 25 23.5 25Z"
        fill="#C1CFDE"
      />
    </SvgIcon>
  );
};
