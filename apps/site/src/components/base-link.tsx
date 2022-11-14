import { UrlObject } from "node:url";

// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import {
  Children,
  cloneElement,
  FunctionComponent,
  isValidElement,
  ReactElement,
} from "react";

import { FRONTEND_URL } from "../lib/config";

export const isHrefExternal = (href: string | UrlObject) =>
  typeof href === "string" &&
  (href.endsWith("/discord") ||
    (!/^(mailto:|#|\/|https:\/\/blockprotocol\.org)/.test(href) &&
      !href.startsWith(FRONTEND_URL)));

export interface BaseLinkProps extends Omit<NextLinkProps, "passHref"> {
  children: ReactElement | string | number;
  "data-testid"?: string;
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

  const external = isHrefExternal(href);
  const properties = {
    "data-testid": rest["data-testid"],
    ...(external && {
      rel: "noopener",
      target: "_blank",
    }),
  };

  const fixedChild = isValidElement(child)
    ? cloneElement(child, properties)
    : child;

  return (
    <NextLink
      {...rest}
      // Setting to true triggers Next.js warning: https://nextjs.org/docs/messages/prefetch-true-deprecated
      prefetch={external ? false : undefined}
      passHref
      legacyBehavior
      href={href}
    >
      {fixedChild}
    </NextLink>
  );
};
