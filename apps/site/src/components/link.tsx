import {
  Link as MuiLink,
  LinkProps as MuiLinkProps,
  styled,
} from "@mui/material";
import rawClsx from "clsx";
import { useRouter } from "next/router.js";
import { forwardRef, isValidElement, ReactNode } from "react";

import { BaseLink, BaseLinkProps } from "./base-link.jsx";
import { Button } from "./button.jsx";

const clsx = rawClsx as unknown as typeof rawClsx.default;

/**
 * This component is based on https://github.com/mui-org/material-ui/blob/a5c92dfd84dfe5888a8b383a9b5fe5701a934564/examples/nextjs/src/Link.js
 */

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled("a")({});

type PlainLinkWithAnchorProps = BaseLinkProps &
  Omit<MuiLinkProps, "href" | "color">;

export const BaseLinkWithAnchor = forwardRef<
  HTMLAnchorElement,
  PlainLinkWithAnchorProps
>((props, ref) => {
  const { as, href, replace, scroll, shallow, locale, ...other } = props;

  return (
    <BaseLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      locale={locale}
      data-testid={other["data-testid"]}
    >
      <Anchor ref={ref} {...other} />
    </BaseLink>
  );
});

export type LinkProps = {
  activeClassName?: string;
  children?: ReactNode;
} & Omit<BaseLinkProps, "children" | "passHref"> &
  Omit<MuiLinkProps, "href" | "color">;

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    props,
    ref, // https://github.com/prettier/prettier/issues/11923
  ) => {
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
      if (isValidElement(children) && children.type === Button) {
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
