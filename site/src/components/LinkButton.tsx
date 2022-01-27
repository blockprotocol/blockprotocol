// eslint-disable-next-line no-restricted-imports
import Link, { LinkProps } from "next/link";
import { VoidFunctionComponent } from "react";
import { ButtonProps, Button } from "./Button";
import { isHrefExternal } from "./Link";

type LinkButtonProps = ButtonProps & LinkProps;

export const LinkButton: VoidFunctionComponent<LinkButtonProps> = ({
  href,
  ...rest
}) => {
  if (isHrefExternal(href)) {
    return <Button href={href} rel="noopener" target="_blank" {...rest} />;
  }

  return (
    <Link href={href} passHref>
      <Button {...rest} />
    </Link>
  );
};
