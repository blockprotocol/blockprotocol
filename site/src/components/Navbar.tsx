import { FC, ReactNode, useState, useEffect, Fragment } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
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
} from "@mui/material";
import { useRouter } from "next/router";
import { BlockProtocolLogoIcon } from "./SvgIcon/BlockProtocolLogoIcon";
import { BlockHubIcon } from "./SvgIcon/BlockHubIcon";
import { SpecificationIcon } from "./SvgIcon/SpecificationIcon";
import { BoltIcon } from "./SvgIcon/BoltIcon";

const MOBILE_NAVBAR_HEIGHT = 57;

type NavBarLink = {
  title: string;
  href: string;
  icon?: ReactNode;
  children?: { title: string; href: string }[];
};

const NAVBAR_LINKS: NavBarLink[] = [
  {
    title: "Block Hub",
    href: "/hub",
    icon: <BlockHubIcon />,
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: <Icon className="fas fa-book-open" />,
    children: [
      {
        title: "Introduction",
        href: "/docs/introduction",
      },
      {
        title: "Quick Start Guide",
        href: "/docs/blocks",
      },
    ],
  },
  {
    title: "Specification",
    href: "/spec",
    icon: <SpecificationIcon />,
    children: [
      {
        title: "Introduction",
        href: "/spec/introduction",
      },
      {
        title: "Terminology",
        href: "/spec/terminology",
      },
    ],
  },
];

type MobileNavItemsProps = {
  setDisplayMobileNav: (value: boolean) => void;
};

const MobileNavItems: FC<MobileNavItemsProps> = ({ setDisplayMobileNav }) => {
  const { asPath } = useRouter();

  const [displayChildrenOfHrefs, setDisplayChildrenOfHrefs] = useState<
    string[]
  >(
    NAVBAR_LINKS.map(({ href }) => href).filter((href) =>
      asPath.startsWith(href),
    ),
  );

  useEffect(() => {
    const displayChildrenOfHref = NAVBAR_LINKS.map(({ href }) => href).find(
      (href) => asPath.startsWith(href),
    );

    if (displayChildrenOfHref) {
      setDisplayChildrenOfHrefs([displayChildrenOfHref]);
    }
  }, [asPath]);

  return (
    <List>
      {NAVBAR_LINKS.map(({ title, icon, href: parentHref, children }, i) => (
        <Fragment key={parentHref}>
          <Link href={parentHref}>
            <a>
              <ListItemButton
                selected={asPath.startsWith(parentHref)}
                onClick={() => {
                  setDisplayChildrenOfHrefs([parentHref]);
                  setDisplayMobileNav(false);
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
                {children && children.length > 0 ? (
                  <IconButton
                    sx={{
                      transition: (theme) =>
                        theme.transitions.create("transform"),
                      transform: `rotate(${
                        displayChildrenOfHrefs.includes(parentHref)
                          ? "0deg"
                          : "-90deg"
                      })`,
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setDisplayChildrenOfHrefs((prev) =>
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
            </a>
          </Link>
          {children && children.length > 0 ? (
            <Collapse
              in={displayChildrenOfHrefs.includes(parentHref)}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {children.map(({ title: childTitle, href: childHref }) => (
                  <Link key={childHref} href={childHref}>
                    <a>
                      <ListItemButton
                        selected={asPath.startsWith(childHref)}
                        onClick={() => {
                          setDisplayChildrenOfHrefs([parentHref]);
                          setDisplayMobileNav(false);
                        }}
                        sx={{
                          backgroundColor: (theme) => theme.palette.gray[20],
                          "&.Mui-selected": {
                            backgroundColor: (theme) => theme.palette.gray[20],
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.gray[40],
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
                    </a>
                  </Link>
                ))}
              </List>
              {i < NAVBAR_LINKS.length - 1 ? <Divider /> : null}
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

  const [displayMobileNav, setDisplayMobileNav] = useState<boolean>();

  const { asPath } = router;

  const isHomePage = asPath === "/";

  const md = useMediaQuery(theme.breakpoints.up("md"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (md && displayMobileNav) {
      setDisplayMobileNav(false);
    }
  }, [md, displayMobileNav]);

  const isNavBarTransparent = (!displayMobileNav && isHomePage) || md;

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
          position: md ? undefined : "fixed",
          zIndex: md ? undefined : 1,
          py: md ? 2 : 1,
          backgroundColor: isNavBarTransparent
            ? "transparent"
            : theme.palette.common.white,
          transition: theme.transitions.create(
            [
              isHomePage ? [] : "border-bottom-color",
              "padding-top",
              "padding-bottom",
            ].flat(),
          ),
          borderBottomStyle: "solid",
          borderBottomColor: isNavBarTransparent
            ? "transparent"
            : theme.palette.gray[30],
          borderBottomWidth: 1,
        }}
      >
        <Container>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Link href="/">
              <a>
                <BlockProtocolLogoIcon
                  onClick={() => setDisplayMobileNav(false)}
                  sx={{
                    color: ({ palette }) =>
                      isHomePage && !displayMobileNav
                        ? palette.purple.subtle
                        : palette.gray[80],
                  }}
                />
              </a>
            </Link>
            <Box display="flex" alignItems="center">
              {md ? (
                <>
                  {NAVBAR_LINKS.map(({ title, href, icon }) => (
                    <Link href={href} key={href} passHref>
                      <Box
                        display="flex"
                        component="a"
                        sx={({ palette }) => ({
                          marginRight: theme.spacing(2),
                          transition: theme.transitions.create("color", {
                            duration: 100,
                          }),
                          color: isHomePage
                            ? palette.purple[400]
                            : asPath === href
                            ? palette.purple[500]
                            : palette.gray[60],
                          "&:hover": {
                            color: isHomePage
                              ? palette.gray[30]
                              : palette.purple[500],
                          },
                          "&:active": {
                            color: isHomePage
                              ? palette.common.white
                              : palette.purple[600],
                          },
                        })}
                      >
                        {icon}
                        <Typography
                          sx={{
                            marginLeft: theme.spacing(1),
                            fontWeight: 500,
                          }}
                        >
                          {title}
                        </Typography>
                      </Box>
                    </Link>
                  ))}
                  <Link href="/docs/quick-start">
                    <Button
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
                    "& svg":
                      isHomePage && !displayMobileNav
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
            <MobileNavItems setDisplayMobileNav={setDisplayMobileNav} />
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
              <Box component="a">
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
              </Box>
            </Link>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};
