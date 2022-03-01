import { VFC, useState, useEffect, useContext, useMemo } from "react";
import {
  Box,
  Typography,
  Icon,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Slide,
  Collapse,
  useScrollTrigger,
} from "@mui/material";
import { useRouter } from "next/router";
import { SiteMapPage, SiteMapPageSection } from "../lib/sitemap";
import { Link } from "./Link";
import { BlockProtocolLogoIcon, BoltIcon } from "./icons";
import { HOME_PAGE_HEADER_HEIGHT } from "../pages/index.page";
import SiteMapContext from "../context/SiteMapContext";
import { useUser } from "../context/UserContext";
import { AccountDropdown } from "./Navbar/AccountDropdown";
import { MobileNavItems } from "./Navbar/MobileNavItems";
import { itemIsPage, NAVBAR_LINK_ICONS } from "./Navbar/util";
import { MobileBreadcrumbs } from "./Navbar/MobileBreadcrumbs";
import { LinkButton } from "./LinkButton";

export const DESKTOP_NAVBAR_HEIGHT = 71.5;

export const MOBILE_NAVBAR_HEIGHT = 57;

const BREAD_CRUMBS_HEIGHT = 36;

const IDLE_NAVBAR_TIMEOUT_MS = 3000;

const findCrumbs = (params: {
  asPath: string;
  item: SiteMapPage | SiteMapPageSection;
  parents?: (SiteMapPage | SiteMapPageSection)[];
  parentHref?: string;
}): (SiteMapPage | SiteMapPageSection)[] | null => {
  const { parents, item, asPath, parentHref } = params;

  for (const section of itemIsPage(item) ? item.sections : item.subSections) {
    const crumbs = findCrumbs({
      asPath,
      item: section,
      parents: [...(parents || []), item],
      parentHref: itemIsPage(item) ? item.href : parentHref,
    });

    if (crumbs) {
      return crumbs;
    }
  }

  if (itemIsPage(item)) {
    for (const page of item.subPages) {
      const crumbs = findCrumbs({
        asPath,
        item: page,
        parents: [...(parents || []), item],
      });

      if (crumbs) {
        return crumbs;
      }
    }
  }

  const href = itemIsPage(item) ? item.href : `${parentHref}#${item.anchor}`;

  if (asPath === href || (itemIsPage(item) && asPath === `${href}#`)) {
    return [...(parents || []), item];
  }

  return null;
};

type NavbarProps = {
  navbarHeight: number;
  setNavbarHeight: (height: number) => void;
  openLoginModal: () => void;
};

export const Navbar: VFC<NavbarProps> = ({
  navbarHeight,
  setNavbarHeight,
  openLoginModal,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { pages } = useContext(SiteMapContext);
  const { user } = useUser();

  const [displayMobileNav, setDisplayMobileNav] = useState<boolean>(false);
  const [idleScrollPosition, setIdleScrollPosition] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;
    const onScroll = () => {
      setScrollY(window.scrollY);
      setIdleScrollPosition(false);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setIdleScrollPosition(true);
      }, IDLE_NAVBAR_TIMEOUT_MS);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const { asPath } = router;

  const isHomePage = asPath === "/";

  const md = useMediaQuery(theme.breakpoints.up("md"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));

  const isDesktopSize = md;

  const crumbs = useMemo(() => {
    const breadCrumbPages = pages.filter(({ title }) =>
      ["Specification", "Documentation"].includes(title),
    );

    for (const page of breadCrumbPages) {
      const maybeCrumbs = findCrumbs({ asPath, item: page });
      if (maybeCrumbs) {
        return maybeCrumbs;
      }
    }
    return [];
  }, [asPath, pages]);

  const displayBreadcrumbs =
    !isDesktopSize && !displayMobileNav && crumbs.length > 0;

  useEffect(() => {
    setNavbarHeight(
      (isDesktopSize ? DESKTOP_NAVBAR_HEIGHT : MOBILE_NAVBAR_HEIGHT) +
        (displayBreadcrumbs ? BREAD_CRUMBS_HEIGHT : 0),
    );
  }, [isDesktopSize, displayBreadcrumbs, setNavbarHeight]);

  useEffect(() => {
    if (isDesktopSize && displayMobileNav) {
      setDisplayMobileNav(false);
    }
  }, [isDesktopSize, displayMobileNav]);

  const preventOverflowingNavLinks = useMediaQuery(
    theme.breakpoints.between("md", 940),
  );

  /** @todo: provide better documentation for the various states of the Navbar's styling */

  const trigger = useScrollTrigger();

  const isScrollYAtTopOfPage = scrollY === 0;

  const isScrollYPastHeader = scrollY > HOME_PAGE_HEADER_HEIGHT;

  const isNavbarPositionAbsolute =
    isHomePage && !displayMobileNav && scrollY < HOME_PAGE_HEADER_HEIGHT * 0.5;

  const isNavbarTransparent =
    isHomePage && !displayMobileNav && !isScrollYPastHeader;

  const isBorderBottomTransparent =
    isNavbarTransparent || (isScrollYAtTopOfPage && !displayMobileNav);

  const isNavbarHidden =
    (trigger ||
      (isHomePage && !isScrollYPastHeader) ||
      (idleScrollPosition && !isScrollYAtTopOfPage)) &&
    !displayMobileNav;

  const isBoxShadowTransparent =
    isBorderBottomTransparent || displayMobileNav || isNavbarHidden;

  /**
   * The Navbar is dark when
   *  - the user is on the homepage, and
   *  - the user hasn't scrolled past the header element, and
   *  - the user is not currently displaying the mobile navigation menu
   */
  const isNavbarDark = isHomePage && !displayMobileNav && !isScrollYPastHeader;

  const hiddenNavbarTopOffset =
    -1 * (navbarHeight - (displayBreadcrumbs ? BREAD_CRUMBS_HEIGHT : 0));

  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        zIndex: ({ zIndex }) => zIndex.appBar,
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: isNavbarPositionAbsolute ? "absolute" : "fixed",
          top:
            isNavbarHidden && !isNavbarPositionAbsolute
              ? hiddenNavbarTopOffset
              : 0,
          zIndex: theme.zIndex.appBar,
          py: isDesktopSize ? 2 : 1,
          backgroundColor: isNavbarTransparent
            ? "transparent"
            : theme.palette.common.white,
          transition: [
            isHomePage &&
            !displayMobileNav &&
            scrollY < HOME_PAGE_HEADER_HEIGHT * 0.75
              ? []
              : theme.transitions.create("top", { duration: 300 }),
            theme.transitions.create(
              [
                "padding-top",
                "padding-bottom",
                "box-shadow",
                "border-bottom-color",
                "background-color",
              ].flat(),
            ),
          ]
            .flat()
            .join(", "),
          borderBottomStyle: "solid",
          borderBottomColor: isBorderBottomTransparent
            ? "transparent"
            : theme.palette.gray[30],
          borderBottomWidth: 1,
          /** @todo: find way to make drop-shadow appear behind mobile navigation links */
          boxShadow: isBoxShadowTransparent ? "none" : theme.shadows[1],
        }}
      >
        <Container>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Link
              href="/"
              sx={{
                color: ({ palette }) =>
                  isNavbarDark ? palette.purple[400] : palette.gray[90],
              }}
            >
              <BlockProtocolLogoIcon
                onClick={() => setDisplayMobileNav(false)}
                sx={{ color: "inherit" }}
              />
            </Link>
            <Box display="flex" alignItems="center">
              {md ? (
                <>
                  {pages.map(({ title, href }) => (
                    <Link
                      href={href}
                      key={href}
                      sx={({ palette }) => ({
                        display: "flex",
                        alignItems: "center",
                        marginRight: 3,
                        transition: theme.transitions.create("color", {
                          duration: 100,
                        }),
                        color: isNavbarDark
                          ? palette.purple[400]
                          : asPath.startsWith(href)
                          ? palette.purple[600]
                          : palette.gray[70],
                        "&:hover": {
                          color: isNavbarDark
                            ? palette.gray[30]
                            : palette.purple[600],
                        },
                        "&:active": {
                          color: isNavbarDark
                            ? palette.common.white
                            : palette.purple[700],
                        },
                      })}
                    >
                      {NAVBAR_LINK_ICONS[title]}
                      <Typography
                        sx={{
                          marginLeft: 1,
                          fontWeight: 500,
                          fontSize: "var(--step--1)",
                          color: "currentColor",
                        }}
                      >
                        {title}
                      </Typography>
                    </Link>
                  ))}
                  {user || router.pathname === "/login" ? null : (
                    <Link
                      href="#"
                      onClick={openLoginModal}
                      sx={{
                        marginRight: 3,
                        backgroundColor: "unset",
                        transition: theme.transitions.create("color", {
                          duration: 100,
                        }),
                        color: ({ palette }) =>
                          isNavbarDark ? palette.purple[400] : palette.gray[70],
                        "&:hover": {
                          color: ({ palette }) =>
                            isNavbarDark
                              ? palette.gray[30]
                              : palette.purple[600],
                        },
                        "&:active": {
                          color: ({ palette }) =>
                            isNavbarDark
                              ? palette.common.white
                              : palette.purple[700],
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "var(--step--1)",
                          color: "currentColor",
                        }}
                      >
                        Log In
                      </Typography>
                    </Link>
                  )}
                  {user !== "loading" && !user?.isSignedUp ? (
                    <LinkButton
                      href="/docs/developing-blocks"
                      size="small"
                      variant="primary"
                      endIcon={<BoltIcon />}
                    >
                      {preventOverflowingNavLinks
                        ? "Build a block"
                        : "Quick Start Guide"}
                    </LinkButton>
                  ) : null}
                </>
              ) : (
                <IconButton
                  onClick={() => setDisplayMobileNav(!displayMobileNav)}
                  sx={{
                    "& svg": isNavbarDark
                      ? { color: theme.palette.purple.subtle }
                      : {},
                  }}
                >
                  <Icon className="fas fa-bars" />
                </IconButton>
              )}
              <AccountDropdown />
            </Box>
          </Box>
          <Collapse in={displayBreadcrumbs}>
            <MobileBreadcrumbs crumbs={crumbs} />
          </Collapse>
        </Container>
      </Box>
      <Slide in={displayMobileNav}>
        <Box
          sx={{
            zIndex: 1,
            marginTop: `${MOBILE_NAVBAR_HEIGHT}px`,
            position: "fixed",
            background: theme.palette.common.white,
            top: 0,
            left: 0,
            width: "100%",
            height: `calc(100% - ${MOBILE_NAVBAR_HEIGHT}px)`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              overflow: "auto",
            }}
          >
            <MobileNavItems onClose={() => setDisplayMobileNav(false)} />
          </Box>

          <Box
            p={5}
            flexShrink={0}
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              borderTopStyle: "solid",
              borderTopWidth: 1,
              borderTopColor: theme.palette.gray[40],
              "> button, a": {
                width: {
                  xs: "100%",
                  sm: "unset",
                },
                minWidth: {
                  xs: "unset",
                  sm: 320,
                },
              },
            }}
          >
            {user ? null : router.pathname === "/login" ? null : (
              <LinkButton
                href="#"
                variant="secondary"
                onClick={(event) => {
                  setDisplayMobileNav(false);
                  openLoginModal();
                  event?.preventDefault();
                }}
                sx={{
                  marginBottom: 1,
                }}
              >
                Log in
              </LinkButton>
            )}
            <LinkButton
              href="/docs/developing-blocks"
              sx={{
                width: "100%",
                py: 1.5,
                px: 3,
                textTransform: "none",
              }}
              variant="primary"
              startIcon={<BoltIcon />}
              onClick={() => setDisplayMobileNav(false)}
            >
              {sm ? "Get started building blocks" : "Build a block"}
            </LinkButton>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};
