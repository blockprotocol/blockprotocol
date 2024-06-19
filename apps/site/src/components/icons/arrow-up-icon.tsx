import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const ArrowUpIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="14" height="15" viewBox="0 0 14 15">
      <path
        d="M12.9062 7.04297C12.75 7.41797 12.375 7.63672 12 7.63672H9V13.6367C9 14.1992 8.53125 14.6367 8 14.6367H6C5.4375 14.6367 5 14.1992 5 13.6367V7.63672H2C1.59375 7.63672 1.21875 7.41797 1.0625 7.04297C0.90625 6.66797 1 6.23047 1.28125 5.94922L6.25 0.949219C6.46875 0.761719 6.71875 0.636719 7 0.636719C7.25 0.636719 7.5 0.761719 7.6875 0.949219L12.6875 5.94922C12.9688 6.23047 13.0625 6.66797 12.9062 7.04297Z"
        fill="#6048E5"
      />
    </SvgIcon>
  );
};
