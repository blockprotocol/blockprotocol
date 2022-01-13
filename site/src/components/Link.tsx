import * as React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps as NextLinkProps } from "next/link";
// eslint-disable-next-line no-restricted-imports
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { styled } from "@mui/material/styles";

/**
 * This component is based on https://github.com/mui-org/material-ui/blob/a5c92dfd84dfe5888a8b383a9b5fe5701a934564/examples/nextjs/src/Link.js
 */

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled("a")({});

type NextLinkComposedProps = {
  to: NextLinkProps["href"];
} & Omit<NextLinkProps, "href" | "passHref"> &
  Omit<MuiLinkProps, "href" | "color">;

export const NextLinkComposed = React.forwardRef<
  HTMLAnchorElement,
  NextLinkComposedProps
>((props, ref) => {
  const { as, to, replace, scroll, shallow, prefetch, locale, ...other } =
    props;

  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
    >
      <Anchor ref={ref} {...other} />
    </NextLink>
  );
});

export type LinkProps = {
  activeClassName?: string;
  noLinkStyle?: boolean;
} & Omit<NextLinkProps, "passHref"> &
  Omit<MuiLinkProps, "href" | "color">;

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const {
      activeClassName = "active",
      as: linkAs,
      className: classNameProps,
      href,
      noLinkStyle,
      ...other
    } = props;

    const router = useRouter();
    const pathname = typeof href === "string" ? href : href.pathname;
    const className = clsx(classNameProps, {
      [activeClassName]: router.pathname === pathname && activeClassName,
    });

    const isExternal =
      typeof href === "string" &&
      (href === "/discord" ||
        !/^(mailto:|#|\/|https:\/\/blockprotocol\.org)/.test(href));

    if (isExternal) {
      other.rel = "noopener";
      other.target = "_blank";

      if (noLinkStyle) {
        return (
          <Anchor
            className={className}
            href={href as string}
            ref={ref}
            {...other}
          />
        );
      }

      return (
        <MuiLink
          className={className}
          href={href as string}
          ref={ref}
          {...other}
        />
      );
    }

    if (noLinkStyle) {
      return (
        <NextLinkComposed
          className={className}
          ref={ref}
          to={href}
          {...other}
        />
      );
    }

    return (
      <MuiLink
        component={NextLinkComposed}
        as={linkAs}
        className={className}
        ref={ref}
        to={href}
        {...other}
      />
    );
  },
);
