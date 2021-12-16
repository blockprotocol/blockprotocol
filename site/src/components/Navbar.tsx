import { FC, useState, useEffect, Fragment, useContext } from "react";
import {
  Box,
  Typography,
  Icon,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Slide,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useScrollTrigger,
} from "@mui/material";
import { useRouter } from "next/router";
import { Button } from "./Button";
import { Link } from "./Link";
import { BlockProtocolLogoIcon } from "./SvgIcon/BlockProtocolLogoIcon";
import { BlockHubIcon } from "./SvgIcon/BlockHubIcon";
import { SpecificationIcon } from "./SvgIcon/SpecificationIcon";
import { BoltIcon } from "./SvgIcon/BoltIcon";
import { HOME_PAGE_HEADER_HEIGHT } from "../pages/index.page";
import SiteMapContext from "./context/SiteMapContext";

export const DESKTOP_NAVBAR_HEIGHT = 71.5;

export const MOBILE_NAVBAR_HEIGHT = 57;

const IDLE_NAVBAR_TIMEOUT_MS = 3000;

const NAVBAR_LINK_ICONS: Record<string, JSX.Element> = {
  "Block Hub": (
    <BlockHubIcon
      sx={{
        width: 18,
        height: 18,
      }}
    />
  ),
  Documentation: (
    <Icon
      className="fas fa-book-open"
      sx={{
        fontSize: 18,
      }}
      fontSize="inherit"
    />
  ),
  Specification: (
    <SpecificationIcon
      sx={{
        width: 18,
        height: 18,
      }}
    />
  ),
};

type MobileNavItemsProps = {
  onClose: () => void;
};

const MobileNavItems: FC<MobileNavItemsProps> = ({ onClose }) => {
  const { asPath } = useRouter();
  const { pages } = useContext(SiteMapContext);

  const [openedNavbarLinks, setOpenedNavbarLinks] = useState<string[]>(
    pages.map(({ href }) => href).filter((href) => asPath.startsWith(href)),
  );

  useEffect(() => {
    const newOpenedNavbarLink = pages.find(({ href }) =>
      asPath.startsWith(href),
    )?.href;

    if (newOpenedNavbarLink) {
      setOpenedNavbarLinks([newOpenedNavbarLink]);
    }
  }, [asPath, pages]);

  return (
    <List>
      {pages.map(({ title, href: parentHref, subPages }, i) => (
        <Fragment key={parentHref}>
          <Link href={parentHref}>
            <ListItemButton
              selected={asPath.startsWith(parentHref)}
              onClick={() => {
                setOpenedNavbarLinks([parentHref]);
                onClose();
              }}
            >
              <ListItemIcon>{NAVBAR_LINK_ICONS[title]}</ListItemIcon>
              <ListItemText primary={title} />
              {subPages && subPages.length > 0 ? (
                <IconButton
                  sx={{
                    transition: (theme) =>
                      theme.transitions.create("transform"),
                    transform: `rotate(${
                      openedNavbarLinks.includes(parentHref) ? "0deg" : "-90deg"
                    })`,
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpenedNavbarLinks((prev) =>
                      prev.includes(parentHref)
                        ? prev.filter((prevHref) => prevHref !== parentHref)
                        : [...prev, parentHref],
                    );
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 15,
                    }}
                    fontSize="inherit"
                    className="fas fa-chevron-down"
                  />
                </IconButton>
              ) : null}
            </ListItemButton>
          </Link>
          {subPages && subPages.length > 0 ? (
            <Collapse
              in={openedNavbarLinks.includes(parentHref)}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {subPages.map(({ title: childTitle, href: childHref }) => (
                  <Link key={childHref} href={childHref}>
                    <ListItemButton
                      selected={asPath.startsWith(childHref)}
                      onClick={() => {
                        setOpenedNavbarLinks([parentHref]);
                        onClose();
                      }}
                      sx={{
                        backgroundColor: (theme) => theme.palette.gray[20],
                        "&.Mui-selected": {
                          backgroundColor: (theme) => theme.palette.gray[20],
                          "&:hover": {
                            backgroundColor: (theme) => theme.palette.gray[40],
                          },
                        },
                        "&:hover": {
                          backgroundColor: (theme) => theme.palette.gray[40],
                        },
                        pl: 9,
                      }}
                    >
                      <ListItemText primary={childTitle} />
                    </ListItemButton>
                  </Link>
                ))}
              </List>
              {i < pages.length - 1 ? <Divider /> : null}
            </Collapse>
          ) : null}
        </Fragment>
      ))}
    </List>
  );
};

type NavbarProps = {};

export const Navbar: FC<NavbarProps> = () => {
  const theme = useTheme();
  const router = useRouter();
  const { pages } = useContext(SiteMapContext);

  const [displayMobileNav, setDisplayMobileNav] = useState<boolean>(false);
  const [idleScrollPosition, setIdleScrollPosition] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(
    typeof window === "undefined" ? 0 : window.scrollY,
  );

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

  useEffect(() => {
    if (isDesktopSize && displayMobileNav) {
      setDisplayMobileNav(false);
    }
  }, [isDesktopSize, displayMobileNav]);

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

  const navbarHeight = isDesktopSize
    ? DESKTOP_NAVBAR_HEIGHT
    : MOBILE_NAVBAR_HEIGHT;

  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: isNavbarPositionAbsolute ? "absolute" : "fixed",
          top: isNavbarHidden && !isNavbarPositionAbsolute ? -navbarHeight : 0,
          zIndex: "appBar",
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
            <Link href="/">
              <BlockProtocolLogoIcon
                onClick={() => setDisplayMobileNav(false)}
                sx={{
                  color: ({ palette }) =>
                    isNavbarDark ? palette.purple.subtle : palette.gray[80],
                }}
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
                          ? palette.purple[300]
                          : asPath.startsWith(href)
                          ? palette.purple[600]
                          : palette.gray[60],
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
                        }}
                      >
                        {title}
                      </Typography>
                    </Link>
                  ))}
                  <Link href="/docs/quick-start">
                    <Button
                      size="small"
                      variant="primary"
                      endIcon={<Icon className="fa-chevron-right" />}
                    >
                      Quick Start Guide
                    </Button>
                  </Link>
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
            </Box>
          </Box>
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
            sx={{
              borderTopStyle: "solid",
              borderTopWidth: 1,
              borderTopColor: theme.palette.gray[40],
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link href="/docs/blocks">
              <Button
                sx={{
                  py: 1.5,
                  px: 3,
                  textTransform: "none",
                }}
                variant="primary"
                startIcon={<BoltIcon />}
                onClick={() => setDisplayMobileNav(false)}
              >
                <Typography sx={{ fontWeight: 500, fontSize: "1.15rem" }}>
                  {sm ? "Get started building blocks" : "Build a block"}
                </Typography>
              </Button>
            </Link>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};
