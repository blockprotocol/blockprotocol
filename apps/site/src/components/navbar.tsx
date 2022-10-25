import { faBars } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Collapse,
  Container,
  IconButton,
  Slide,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import _clsx from "clsx";
import { useRouter } from "next/router.js";
import {
  FunctionComponent,
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { unstable_batchedUpdates } from "react-dom";

import SiteMapContext from "../context/site-map-context.js";
import { useUser } from "../context/user-context.js";
import { HOME_PAGE_HEADER_HEIGHT } from "../pages/index.page.jsx";
import { getScrollbarSize } from "../util/mui-utils.jsx";
import { Button } from "./button.jsx";
import { useCrumbs } from "./hooks/use-crumbs.js";
import { BlockProtocolLogoIcon, FontAwesomeIcon } from "./icons/index.js";
import { Link } from "./link.jsx";
import { LinkButton } from "./link-button.jsx";
import { AccountDropdown } from "./navbar/account-dropdown.jsx";
import { MobileBreadcrumbs } from "./navbar/mobile-breadcrumbs.jsx";
import { MobileNavItems } from "./navbar/mobile-nav-items.jsx";
import { NAVBAR_LINK_ICONS } from "./navbar/util.jsx";
import { SearchNavButton } from "./search-nav-button.jsx";
import {
  generatePathWithoutParams,
  useHydrationFriendlyAsPath,
} from "./shared.js";

const clsx = _clsx as unknown as typeof _clsx.default;

export const DESKTOP_NAVBAR_HEIGHT = 71.5;

export const MOBILE_NAVBAR_HEIGHT = 53;

const BREAD_CRUMBS_HEIGHT = 36;

const IDLE_NAVBAR_TIMEOUT_MS = 3_000;

type NavbarProps = {
  openLoginModal: () => void;
};

const navbarClasses = {
  link: "Navbar-Link",
  interactiveLink: "Navbar-InteractiveLink",
};

const useLastScrollbarSize = () => {
  const [lastScrollbarSize, setLastScrollbarSize] = useState(0);
  const observerRef = useRef<ResizeObserver>();

  useEffect(() => {
    observerRef.current = new ResizeObserver(() => {
      const scrollbarSize = getScrollbarSize(document);
      if (scrollbarSize > 0) {
        setLastScrollbarSize(scrollbarSize);
      }
    });

    observerRef.current.observe(document.body);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return lastScrollbarSize;
};

const useMobileNavVisible = (canDisplayMobileNav: boolean) => {
  const [mobileNavVisible, setMobileNavVisible] = useState(false);

  if (!canDisplayMobileNav && mobileNavVisible) {
    setMobileNavVisible(false);
  }

  return [mobileNavVisible, setMobileNavVisible] as const;
};

const useScrollingNavbar = (
  alwaysVisible: boolean,
  threshold: number | null,
  mobileNavVisible: boolean,
) => {
  const [navbarHiddenByIdle, setNavbarHiddenByIdle] = useState(false);

  const defaultScrolledPast = {
    0: false,
    ...(threshold !== null
      ? {
          [threshold * 0.5]: false,
          [threshold * 0.75]: false,
          [threshold]: false,
        }
      : {}),
  };
  const [scrolledPast, setScrolledPast] =
    useState<Record<string, boolean>>(defaultScrolledPast);

  if (
    threshold !== null &&
    !Object.prototype.hasOwnProperty.call(defaultScrolledPast, threshold)
  ) {
    setScrolledPast(defaultScrolledPast);
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;
    const onScroll = () => {
      unstable_batchedUpdates(() => {
        setScrolledPast((currentValue) => {
          const nextScrolledPast = Object.fromEntries(
            Object.keys(currentValue).map((stringThreshold: string) => [
              stringThreshold,
              window.scrollY > Number(stringThreshold),
            ]),
          );

          return (threshold !== null &&
            !Object.prototype.hasOwnProperty.call(
              nextScrolledPast,
              threshold,
            )) ||
            Object.keys(nextScrolledPast).some(
              (key) => nextScrolledPast[key] !== currentValue[key],
            )
            ? nextScrolledPast
            : currentValue;
        });

        setNavbarHiddenByIdle(false);
      });

      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setNavbarHiddenByIdle(true);
      }, IDLE_NAVBAR_TIMEOUT_MS);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  const trigger = useScrollTrigger();

  const isNavbarHidden =
    !mobileNavVisible &&
    !alwaysVisible &&
    scrolledPast[0] &&
    (trigger ||
      (threshold !== null && !scrolledPast[threshold]) ||
      navbarHiddenByIdle);

  return { scrolledPast, isNavbarHidden };
};

// @todo remove asPath from Navbar
export const Navbar: FunctionComponent<NavbarProps> = ({ openLoginModal }) => {
  const theme = useTheme();
  const { pathname } = useRouter();
  const hydrationFriendlyAsPath = useHydrationFriendlyAsPath();
  const { pages } = useContext(SiteMapContext);
  const { user } = useUser();
  const lastScrollbarSize = useLastScrollbarSize();

  const isHomePage = generatePathWithoutParams(hydrationFriendlyAsPath) === "/";
  const isDocs = hydrationFriendlyAsPath.startsWith("/docs");

  const md = useMediaQuery(theme.breakpoints.up("md"));

  const [mobileNavVisible, setMobileNavVisible] = useMobileNavVisible(!md);

  const { scrolledPast, isNavbarHidden } = useScrollingNavbar(
    isDocs,
    isHomePage ? HOME_PAGE_HEADER_HEIGHT : null,
    mobileNavVisible,
  );

  const navbarHeight = md ? DESKTOP_NAVBAR_HEIGHT : MOBILE_NAVBAR_HEIGHT;

  const crumbs = useCrumbs(pages, hydrationFriendlyAsPath);

  const displayBreadcrumbs = !md && !mobileNavVisible && crumbs.length > 0;
  const neighbourOffset =
    navbarHeight + (displayBreadcrumbs ? BREAD_CRUMBS_HEIGHT : 0);

  useEffect(() => {
    document.body.style.overflow = mobileNavVisible ? "hidden" : "auto";
  }, [mobileNavVisible]);

  const handleLoginButtonClick = useCallback<MouseEventHandler>(
    (event) => {
      openLoginModal();
      event.preventDefault();
    },
    [openLoginModal],
  );

  return (
    <Box
      sx={[
        {
          width: "100vw",
          position: "absolute",
          zIndex: ({ zIndex }) => zIndex.appBar,
        },
        !isHomePage && { "+ *": { paddingTop: `${neighbourOffset}px` } },
      ]}
    >
      <Box
        sx={[
          {
            /**
             * header container width is always 100vw,
             * to keep the header alignment correct when we open/close modals,
             * we set `paddingRight` to the last lastScrollbarSize, because scrollbar hides when modal opens,
             * so we want to apply the scrollbarSize as padding.
             * @see https://app.asana.com/0/1200211978612931/1202765662321717/f for the issue this change fixes
             */
            width: "100vw",
            pr: `${lastScrollbarSize}px`,
            position: "fixed",
            top: isNavbarHidden ? navbarHeight * -1 : 0,
            zIndex: theme.zIndex.appBar,
            py: md ? 2 : 1,
            backgroundColor: theme.palette.common.white,
            transition: theme.transitions.create([
              ...(!isHomePage ||
              mobileNavVisible ||
              scrolledPast[HOME_PAGE_HEADER_HEIGHT * 0.75]
                ? ["top"]
                : []),
              "padding-top",
              "padding-bottom",
              "box-shadow",
              "border-bottom-color",
              "background-color",
            ]),
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "transparent",
            /** @todo: find way to make drop-shadow appear behind mobile navigation links */
            ...(isDocs ||
            scrolledPast[isHomePage ? HOME_PAGE_HEADER_HEIGHT : 0] ||
            mobileNavVisible
              ? {
                  borderBottomColor: theme.palette.gray[30],
                  boxShadow:
                    !mobileNavVisible && !isNavbarHidden && !isDocs
                      ? theme.shadows[1]
                      : "none",
                }
              : {}),

            [`& .${navbarClasses.interactiveLink}`]: {
              marginRight: 3,
              transition: theme.transitions.create("color", {
                duration: 100,
              }),
              color: theme.palette.gray[70],
              "&:hover": {
                color: theme.palette.purple[600],
              },
              "&:active": {
                color: theme.palette.purple[700],
              },
            },
          },
          ...(isHomePage && !mobileNavVisible
            ? [
                !scrolledPast[HOME_PAGE_HEADER_HEIGHT * 0.5] && {
                  position: "absolute",
                  top: 0,
                },
              ]
            : []),
        ]}
      >
        <Container
          component="header"
          sx={[
            isDocs && { width: "100% !important", maxWidth: "100% !important" },
          ]}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Link
              href="/"
              sx={{
                color: ({ palette }) => palette.gray[90],
              }}
              className={navbarClasses.link}
            >
              <BlockProtocolLogoIcon
                onClick={() => setMobileNavVisible(false)}
                sx={{ color: "inherit" }}
              />
            </Link>
            <Box display="flex" alignItems="center">
              {md ? (
                <>
                  <SearchNavButton />

                  {pages.map(({ title, href }) => (
                    <Link
                      href={href}
                      key={href}
                      className={clsx(
                        navbarClasses.link,
                        navbarClasses.interactiveLink,
                      )}
                      sx={[
                        {
                          display: "flex",
                          alignItems: "center",
                        },
                        hydrationFriendlyAsPath.startsWith(href) && {
                          color: theme.palette.purple[600],
                        },
                      ]}
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
                  {user || pathname === "/login" ? null : (
                    <Link
                      href="#"
                      onClick={handleLoginButtonClick}
                      className={clsx(
                        navbarClasses.link,
                        navbarClasses.interactiveLink,
                      )}
                      sx={{ backgroundColor: "unset" }}
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
                    <LinkButton href="/signup" size="small" variant="primary">
                      Sign Up
                    </LinkButton>
                  ) : null}
                </>
              ) : (
                <IconButton
                  data-testid="mobile-nav-trigger"
                  onClick={() => setMobileNavVisible(!mobileNavVisible)}
                >
                  <FontAwesomeIcon
                    sx={{
                      fontSize: 20,
                    }}
                    icon={faBars}
                  />
                </IconButton>
              )}
              <AccountDropdown />
            </Box>
          </Box>
          <Collapse in={displayBreadcrumbs}>
            <MobileBreadcrumbs
              hydrationFriendlyAsPath={hydrationFriendlyAsPath}
              crumbs={crumbs}
            />
          </Collapse>
        </Container>
      </Box>
      <Slide
        data-testid="mobile-nav"
        in={mobileNavVisible}
        direction="right"
        timeout={400}
        easing={{
          enter: "ease-in-out",
          exit: "ease-in-out",
        }}
      >
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
              overflowY: "auto",
              overflowX: "hidden",
              overscrollBehavior: "contain",
            }}
          >
            <MobileNavItems
              hydrationFriendlyAsPath={hydrationFriendlyAsPath}
              onClose={() => setMobileNavVisible(false)}
            />
          </Box>

          {user ? null : (
            <Box
              flexShrink={0}
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                paddingY: 4,
                paddingX: 4.25,
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
              <Button
                variant="secondary"
                onClick={() => {
                  setMobileNavVisible(false);
                  openLoginModal();
                }}
                sx={{
                  fontSize: 18,
                  marginBottom: 1.25,
                }}
              >
                Log in
              </Button>

              <LinkButton
                href="/signup"
                sx={{
                  fontSize: 18,
                }}
                variant="primary"
                onClick={() => setMobileNavVisible(false)}
              >
                Sign Up
              </LinkButton>
            </Box>
          )}
        </Box>
      </Slide>
    </Box>
  );
};
