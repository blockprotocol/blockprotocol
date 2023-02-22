import { SvgIcon, SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

export const SpecificationIcon: FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M4.66663 2V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3334 2V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 4.6665H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.86671 7.3335H12.1334C12.2748 7.3335 12.4105 7.38969 12.5105 7.48971C12.6105 7.58972 12.6667 7.72538 12.6667 7.86683V12.1335C12.6667 12.2749 12.6105 12.4106 12.5105 12.5106C12.4105 12.6106 12.2748 12.6668 12.1334 12.6668H7.86671C7.72526 12.6668 7.5896 12.6106 7.48958 12.5106C7.38956 12.4106 7.33337 12.2749 7.33337 12.1335V7.86683C7.33337 7.72538 7.38956 7.58972 7.48958 7.48971C7.5896 7.38969 7.72526 7.3335 7.86671 7.3335Z"
        fill="currentColor"
      />
      <path
        d="M2 15.3335H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
