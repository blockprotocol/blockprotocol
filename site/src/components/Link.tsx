import * as React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";

// eslint-disable-next-line no-restricted-imports
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { BaseLink, BaseLinkProps } from "./BaseLink";
import { Button } from "./Button";

/**
 * This component is based on https://github.com/mui-org/material-ui/blob/a5c92dfd84dfe5888a8b383a9b5fe5701a934564/examples/nextjs/src/Link.js
 */

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled("a")({});

type PlainLinkWithAnchorProps = BaseLinkProps &
  Omit<MuiLinkProps, "href" | "color">;

export const BaseLinkWithAnchor = React.forwardRef<
  HTMLAnchorElement,
  PlainLinkWithAnchorProps
>((props, ref) => {
  const { as, href, replace, scroll, shallow, prefetch, locale, ...other } =
    props;

  return (
    <BaseLink
      href={href}
      prefetch={prefetch}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      locale={locale}
    >
      <Anchor ref={ref} {...other} />
    </BaseLink>
  );
});

export type LinkProps = {
  activeClassName?: string;
  children?: React.ReactNode;
} & Omit<BaseLinkProps, "children" | "passHref"> &
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
      ...rest
    } = props;

    const router = useRouter();
    const pathname =
      typeof href === "string" ? href : href.pathname ?? undefined;
    const className = clsx(classNameProps, {
      [activeClassName]: router.pathname === pathname && activeClassName,
    });

    if (process.env.NODE_ENV !== "production") {
      const { children } = rest;
      if (React.isValidElement(children) && children.type === Button) {
        throw new Error(
          "Please use <LinkButton /> instead of <Link><Button /></Link>",
        );
      }
    }

    return (
      <MuiLink
        component={BaseLinkWithAnchor}
        as={linkAs}
        className={className}
        ref={ref}
        href={href as string}
        {...rest}
      />
    );
  },
);
