import { forwardRef, FunctionComponent, ReactNode } from "react";

import { BaseLink, BaseLinkProps } from "./base-link";
import { Button, ButtonProps } from "./button";

export interface LinkButtonProps
  extends Omit<ButtonProps, "href">,
    Omit<
      BaseLinkProps,
      "children" | "onClick" | "onMouseEnter" | "onTouchStart"
    > {
  children: ReactNode;
  linkProps?: Omit<BaseLinkProps, "children" | "href">;
}

export const LinkButton: FunctionComponent<LinkButtonProps> = forwardRef(
  ({ href, linkProps, ...rest }, ref) => {
    return (
      <BaseLink {...linkProps} href={href}>
        <Button ref={ref} {...rest} />
      </BaseLink>
    );
  },
);
