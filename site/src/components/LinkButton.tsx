import { VoidFunctionComponent } from "react";
import { ButtonProps, Button } from "./Button";
import { BaseLink, BaseLinkProps } from "./BaseLink";

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
