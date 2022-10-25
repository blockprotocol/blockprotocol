import { forwardRef, FunctionComponent, ReactNode } from "react";

import { BaseLink, BaseLinkProps } from "./base-link.jsx";
import { Button, ButtonProps } from "./button.jsx";

export interface LinkButtonProps
  extends Omit<ButtonProps, "href">,
    Omit<
      BaseLinkProps,
      "children" | "onClick" | "onMouseEnter" | "onTouchStart"
    > {
  children: ReactNode;
}

export const LinkButton: FunctionComponent<LinkButtonProps> = forwardRef(
  ({ href, ...rest }, ref) => {
    return (
      <BaseLink href={href}>
        <Button ref={ref} {...rest} />
      </BaseLink>
    );
  },
);
