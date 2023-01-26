import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const BrowserIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      {...props}
      width="512"
      height="512"
      viewBox="0 0 512 512"
      fill="#C1CFDE"
    >
      <path
        d="M0 96C0 60.65 28.65 32 64 32H448C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96zM160 128H480V96C480 78.33 465.7 64 448 64H160V128zM128 64H64C46.33 64 32 78.33 32 96V128H128V64zM32 160V416C32 433.7 46.33 448 64 448H448C465.7 448 480 433.7 480 416V160H32z"
        fill="inherit"
      />
    </SvgIcon>
  );
};
