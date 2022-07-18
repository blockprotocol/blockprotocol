// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { UrlObject } from "node:url";
import {
  Children,
  cloneElement,
  FunctionComponent,
  isValidElement,
} from "react";

import { FRONTEND_URL } from "../lib/config";

export const isHrefExternal = (href: string | UrlObject) =>
  typeof href === "string" &&
  (href === "/discord" ||
    !/^(mailto:|#|\/|https:\/\/blockprotocol\.org)/.test(href)) &&
  !href.startsWith(FRONTEND_URL);

export interface BaseLinkProps extends Omit<NextLinkProps, "passHref"> {
  children: React.ReactChild;
}

/**
 * This component is a wrapper around Next.js link.
 * It makes sure that all external links are opened in a new tab.
 * @see Link, LinkButton
 */
export const BaseLink: FunctionComponent<BaseLinkProps> = ({
  href,
  children,
  ...rest
}) => {
  const child = Children.only(children);

  const fixedChild =
    isValidElement(child) && isHrefExternal(href)
      ? cloneElement(child, { rel: "noopener", target: "_blank" })
      : child;

  return (
    <NextLink {...rest} passHref href={href}>
      {fixedChild}
    </NextLink>
  );
};
