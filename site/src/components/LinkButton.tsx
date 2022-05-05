import { VoidFunctionComponent } from "react";

import { BaseLink, BaseLinkProps } from "./BaseLink";
import { Button, ButtonProps } from "./Button";

export interface LinkButtonProps
  extends Omit<ButtonProps, "href" | "onMouseEnter" | "onClick">,
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
