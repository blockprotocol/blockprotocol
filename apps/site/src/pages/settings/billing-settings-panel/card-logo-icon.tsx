import { SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

import { CcAmexIcon } from "../../../components/icons/cc-amex-icon";
import { CcDiscoverIcon } from "../../../components/icons/cc-discover-icon";
import { CcJcbIcon } from "../../../components/icons/cc-jcb-icon";
import { CcMastercardIcon } from "../../../components/icons/cc-mastercard-icon";
import { CcVisaIcon } from "../../../components/icons/cc-visa-icon";
import { CreditCardSolidIcon } from "../../../components/icons/credit-card-solid";

const cardIcons = {
  amex: CcAmexIcon,
  mastercard: CcMastercardIcon,
  visa: CcVisaIcon,
  discover: CcDiscoverIcon,
  jcb: CcJcbIcon,
  default: CreditCardSolidIcon,
} as const;

export const CardLogoIcon: FunctionComponent<
  { cardBrand?: string } & SvgIconProps
> = ({ cardBrand, ...svgIconProps }) => {
  const Icon =
    cardIcons[(cardBrand as keyof typeof cardIcons) ?? "default"] ??
    cardIcons.default;

  return <Icon {...svgIconProps} />;
};
