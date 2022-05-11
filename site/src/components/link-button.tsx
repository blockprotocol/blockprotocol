import { VoidFunctionComponent } from "react";

import { BaseLink, BaseLinkProps } from "./base-link";
import { Button, ButtonProps } from "./button";

export interface LinkButtonProps
  extends Omit<ButtonProps, "href">,
    Omit<BaseLinkProps, "children"> {
  children: React.ReactNode;
}

export const LinkButton: VoidFunctionComponent<LinkButtonProps> = ({
  href,
  ...rest
}) => {
  return (
    <BaseLink href={href}>
      <Button {...rest} />
    </BaseLink>
  );
};
