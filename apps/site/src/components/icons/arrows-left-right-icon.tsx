import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const ArrowsLeftRightIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="512" height="512" viewBox="0 0 512 512">
      <path
        d="M507.3 267.3l-112 112C392.2 382.4 388.1 384 384 384s-8.188-1.562-11.31-4.688c-6.25-6.25-6.25-16.38 0-22.62L457.4 272H54.63l84.69 84.69c6.25 6.25 6.25 16.38 0 22.62C136.2 382.4 132.1 384 128 384s-8.188-1.562-11.31-4.688l-112-112c-6.25-6.25-6.25-16.38 0-22.62l112-112c6.25-6.25 16.38-6.25 22.62 0s6.25 16.38 0 22.62L54.63 240h402.8l-84.69-84.69c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0l112 112C513.6 250.9 513.6 261.1 507.3 267.3z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
