import { BlockMetadata } from "@blockprotocol/core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Container,
  IconButton,
  Slide,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import { clsx } from "clsx";
import { useRouter } from "next/router";
import {
  FunctionComponent,
  ReactNode,
  RefCallback,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { unstable_batchedUpdates } from "react-dom";

import SiteMapContext from "../context/site-map-context";
import { SiteMapPage } from "../lib/sitemap";
import { HOME_PAGE_HEADER_HEIGHT } from "../pages/index.page";
import { getScrollbarSize } from "../util/mui-utils";
import { Crumb, useCrumbs } from "./hooks/use-crumbs";
import { BlockProtocolLogoIcon, FontAwesomeIcon } from "./icons";
import { Link } from "./link";
import { MobileBreadcrumbs } from "./navbar/mobile-breadcrumbs";
import { MobileNavItems } from "./navbar/mobile-nav-items";
import { NAVBAR_LINK_ICONS } from "./navbar/util";
import { SearchNavButton } from "./search-nav-button";
import {
  generatePathWithoutParams,
  useHydrationFriendlyAsPath,
} from "./shared";
import { VersionPicker } from "./version-picker";

export const DESKTOP_NAVBAR_HEIGHT = 73;

export const MOBILE_NAVBAR_HEIGHT = 53;

const IDLE_NAVBAR_TIMEOUT_MS = 3_000;

const navbarClasses = {
  link: "Navbar-Link",
  interactiveLink: "Navbar-InteractiveLink",
};

const useResizeObserver = (handler: ResizeObserverCallback) => {
  const observerRef = useRef<ResizeObserver | null>(null);

  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  if (typeof window !== "undefined" && !observerRef.current) {
    observerRef.current = new ResizeObserver((...args) => {
      handlerRef.current(...args);
    });
  }

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return observerRef.current;
};

const useLastScrollbarSize = () => {
  const [lastScrollbarSize, setLastScrollbarSize] = useState(0);

  const observer = useResizeObserver(() => {
    const scrollbarSize = getScrollbarSize(document);
    if (scrollbarSize > 0) {
      setLastScrollbarSize(scrollbarSize);
    }
  });

  useEffect(() => {
    observer?.observe(document.body);

    return () => {
      observer?.unobserve(document.body);
    };
  }, [observer]);

  return lastScrollbarSize;
};

const useMobileNavVisible = () => {
  const theme = useTheme();
  const canDisplayMobileNav = useMediaQuery(theme.breakpoints.down("md"));
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

const useBreadcrumbsHeight = () => {
  const [breadcrumbsHeight, setBreadcrumbsHeight] = useState(0);
  const observer = useResizeObserver((entries) => {
    const entry = entries[0]?.borderBoxSize?.[0];

    if (entry) {
      setBreadcrumbsHeight(entry.blockSize);
    }
  });

  const breadcrumbsRef = useCallback(
    (node: HTMLElement | null) => {
      observer?.disconnect();
      if (node) {
        observer?.observe(node);
      }
    },
    [observer],
  );

  return [breadcrumbsRef, breadcrumbsHeight] as const;
};

const Navbar: FunctionComponent<{
  crumbs: Crumb[];
  pages: SiteMapPage[];
  hydrationFriendlyAsPath: string;
  breadcrumbsRef: RefCallback<HTMLDivElement>;
}> = ({ crumbs, hydrationFriendlyAsPath, pages, breadcrumbsRef }) => {
  const theme = useTheme();

  const lastScrollbarSize = useLastScrollbarSize();

  const isHomePage = generatePathWithoutParams(hydrationFriendlyAsPath) === "/";
  const isDocs =
    hydrationFriendlyAsPath.startsWith("/docs") ||
    hydrationFriendlyAsPath.startsWith("/spec") ||
    hydrationFriendlyAsPath.startsWith("/roadmap");
  const isTypeEditor = hydrationFriendlyAsPath.includes("/types/entity-type/");
  const [mobileNavVisible, setMobileNavVisible] = useMobileNavVisible();

  const { scrolledPast, isNavbarHidden } = useScrollingNavbar(
    isDocs || isTypeEditor,
    isHomePage ? HOME_PAGE_HEADER_HEIGHT : null,
    mobileNavVisible,
  );

  useEffect(() => {
    document.body.style.overflow = mobileNavVisible ? "hidden" : "auto";
  }, [mobileNavVisible]);

  return (
    <Box
      sx={[
        {
          height: "var(--navbar-height)",
          width: "100vw",
          position: "absolute",
          zIndex: ({ zIndex }) => zIndex.appBar,
        },
      ]}
    >
      <Box
        sx={[
          {
            width: "100vw",
            pr: `${lastScrollbarSize}px`,
            position: "fixed",
            top: isNavbarHidden ? `calc(0px - var(--navbar-height))` : 0,
            zIndex: theme.zIndex.appBar,
            py: { xs: 1, md: 2 },
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
            isDocs && {
              width: "100% !important",
              maxWidth: "100% !important",
            },
          ]}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Link
                href="/"
                onClick={(event) => {
                  setMobileNavVisible(false);
                  // When already on `/`, suppress Next.js's same-URL
                  // navigation (which throws an "Invariant: attempted to hard
                  // navigate to the same URL" runtime error) and treat the
                  // logo click as a scroll-to-top instead.
                  if (
                    isHomePage &&
                    typeof window !== "undefined" &&
                    !window.location.hash
                  ) {
                    event.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                sx={{
                  color: ({ palette }) => palette.gray[90],
                }}
                className={navbarClasses.link}
              >
                <BlockProtocolLogoIcon sx={{ color: "inherit" }} />
              </Link>
              {isDocs ? <VersionPicker /> : null}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 2.75, md: 4 },
              }}
            >
              <Box
                display={{ md: "flex", xs: "none" }}
                gap={{ xs: 2.75, md: 4 }}
                alignItems="center"
              >
                <SearchNavButton />

                {pages
                  .filter(({ title }) => title === "Docs" || title === "Hub")
                  .map(({ title, href }) => (
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
                        variant="bpHeading3"
                        sx={{
                          marginLeft: 1,
                          fontWeight: 500,
                          fontSize: "var(--step--1)",
                          color: "currentColor",
                          ...(title === "Hub" ? { fontStyle: "italic" } : {}),
                        }}
                      >
                        {title}
                      </Typography>
                    </Link>
                  ))}
              </Box>

              <Box
                display={{ md: "none", xs: "flex" }}
                gap={{ xs: 2.75, md: 4 }}
                alignItems="center"
              >
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
              </Box>
            </Box>
          </Box>
          <Box
            ref={breadcrumbsRef}
            display={{ xs: crumbs.length ? "block" : "none", md: "none" }}
          >
            <MobileBreadcrumbs
              hydrationFriendlyAsPath={hydrationFriendlyAsPath}
              crumbs={crumbs}
            />
          </Box>
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
            zIndex: theme.zIndex.appBar + 1,
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
            borderTopStyle: "solid",
            borderTopWidth: 1,
            borderTopColor: theme.palette.gray[30],
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
        </Box>
      </Slide>
    </Box>
  );
};

export const NavbarContainer = ({
  children,
  blockMetadata,
}: {
  blockMetadata?: BlockMetadata;
  children: ReactNode;
}) => {
  const { route } = useRouter();
  const hydrationFriendlyAsPath = useHydrationFriendlyAsPath();
  const { pages, versionedSubPages } = useContext(SiteMapContext);

  const [breadcrumbsRef, breadcrumbsHeight] = useBreadcrumbsHeight();

  const crumbs = useCrumbs(
    pages,
    hydrationFriendlyAsPath,
    route,
    blockMetadata,
    versionedSubPages,
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      sx={[
        {
          "--navbar-height": `${MOBILE_NAVBAR_HEIGHT}px`,
          "--crumbs-height": `${crumbs.length ? breadcrumbsHeight : 0}px`,
          "--neighbour-offset": `calc(var(--navbar-height) + var(--crumbs-height))`,
        },
        (theme) => ({
          [theme.breakpoints.up("md")]: {
            "--navbar-height": `${DESKTOP_NAVBAR_HEIGHT}px`,
            "--crumbs-height": "0px",
          },
        }),
      ]}
    >
      <Navbar
        crumbs={crumbs}
        hydrationFriendlyAsPath={hydrationFriendlyAsPath}
        pages={pages}
        breadcrumbsRef={breadcrumbsRef}
      />
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        sx={{ paddingTop: "var(--neighbour-offset)" }}
      >
        {children}
      </Box>
    </Box>
  );
};
