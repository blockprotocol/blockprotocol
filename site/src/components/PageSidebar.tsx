import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
  VFC,
} from "react";
import { useRouter } from "next/router";
import {
  Collapse,
  Box,
  Icon,
  IconButton,
  Divider,
  styled,
  BoxProps,
  useTheme,
} from "@mui/material";
import { SiteMapPage, SiteMapPageSection } from "../lib/sitemap";
import { Link } from "./Link";
import { DESKTOP_NAVBAR_HEIGHT } from "./Navbar";
import { parseIntFromPixelString } from "../util/muiUtils";

export const SIDEBAR_WIDTH = 220;

const SidebarLink = styled(Link)(({ theme }) => ({
  display: "block",
  lineHeight: "1.25em",
  transition: theme.transitions.create(["color"]),
  color: theme.palette.gray[80],
  ":hover": {
    color: theme.palette.purple[600],
  },
  fontWeight: 400,
  fontSize: 15,
}));

type SidebarPageSectionProps = {
  depth?: number;
  isSelectedByDefault?: boolean;
  pageHref: string;
  section: SiteMapPageSection;
  maybeUpdateSelectedOffsetTop: () => void;
  setSelectedAnchorElement: (element: HTMLAnchorElement) => void;
  openedPages: string[];
  setOpenedPages: Dispatch<SetStateAction<string[]>>;
};

const SidebarPageSection: VFC<SidebarPageSectionProps> = ({
  depth = 0,
  isSelectedByDefault = false,
  pageHref,
  section,
  maybeUpdateSelectedOffsetTop,
  setSelectedAnchorElement,
  openedPages,
  setOpenedPages,
}) => {
  const router = useRouter();
  const { asPath } = router;

  const { title: sectionTitle, anchor: sectionAnchor, subSections } = section;

  const sectionHref = sectionAnchor ? `${pageHref}#${sectionAnchor}` : pageHref;

  const isSectionSelected =
    asPath === sectionHref ||
    (isSelectedByDefault && (asPath === pageHref || asPath === `${pageHref}#`));
  const hasSelectedSubSection =
    subSections?.find(
      ({ anchor: subSectionAnchor }) =>
        asPath === `${pageHref}#${subSectionAnchor}`,
    ) !== undefined;
  const isSectionOpen = openedPages.includes(sectionHref);

  return (
    <>
      <Box mb={1.5} display="flex" alignItems="flex-start">
        <SidebarLink
          replace
          ref={(ref) => {
            if (ref && isSectionSelected) {
              setSelectedAnchorElement(ref);
            }
          }}
          href={sectionHref}
          sx={(theme) => ({
            paddingLeft: depth * 1 + 1.25,
            color: isSectionSelected
              ? theme.palette.purple[600]
              : theme.palette.gray[80],
            fontWeight: isSectionSelected ? 700 : 400,
          })}
        >
          {sectionTitle}
        </SidebarLink>
        {subSections && subSections.length > 0 ? (
          <IconButton
            onClick={async () => {
              if (hasSelectedSubSection) {
                await router.push(sectionHref);
              }
              setOpenedPages((prev) =>
                prev.includes(sectionHref)
                  ? prev.filter((prevHref) => prevHref !== sectionHref)
                  : [...prev, sectionHref],
              );
            }}
            sx={(theme) => ({
              padding: 0,
              marginLeft: 1,
              marginTop: 0.5,
              transition: theme.transitions.create("transform"),
              transform: `rotate(${isSectionOpen ? "90deg" : "0deg"})`,
              "& svg": {
                color: isSectionSelected
                  ? theme.palette.purple[600]
                  : theme.palette.gray[50],
              },
            })}
          >
            <Icon
              className="fa-chevron-right"
              sx={{
                fontSize: 14,
              }}
            />
          </IconButton>
        ) : null}
      </Box>
      {subSections && subSections.length > 0 ? (
        <Collapse
          in={isSectionOpen}
          onEntered={maybeUpdateSelectedOffsetTop}
          onExited={maybeUpdateSelectedOffsetTop}
        >
          {subSections.map((subSection) => (
            <SidebarPageSection
              depth={depth + 1}
              key={subSection.anchor}
              pageHref={pageHref}
              section={subSection}
              maybeUpdateSelectedOffsetTop={maybeUpdateSelectedOffsetTop}
              setSelectedAnchorElement={setSelectedAnchorElement}
              openedPages={openedPages}
              setOpenedPages={setOpenedPages}
            />
          ))}
        </Collapse>
      ) : null}
    </>
  );
};

type SidebarPageProps = {
  page: SiteMapPage;
  maybeUpdateSelectedOffsetTop: () => void;
  setSelectedAnchorElement: (element: HTMLAnchorElement) => void;
  openedPages: string[];
  setOpenedPages: Dispatch<SetStateAction<string[]>>;
};

const SidebarPage: VFC<SidebarPageProps> = ({
  page,
  maybeUpdateSelectedOffsetTop,
  setSelectedAnchorElement,
  openedPages,
  setOpenedPages,
}) => {
  const router = useRouter();
  const { asPath } = router;

  const { href, title, sections } = page;

  const isSelected = asPath === href || asPath === `${href}#`;
  const isOpen = openedPages.includes(href);

  return (
    <Fragment key={href}>
      <Box mb={1.5} display="flex" alignItems="flex-start">
        <SidebarLink
          ref={(ref) => {
            if (ref && isSelected) {
              setSelectedAnchorElement(ref);
            }
          }}
          scroll={!asPath?.startsWith("/docs") && !asPath?.startsWith("/spec")}
          href={href}
          sx={(theme) => ({
            alignSelf: "flex-start",
            color: isSelected
              ? theme.palette.purple[600]
              : theme.palette.gray[80],
            fontWeight: isSelected ? 700 : 400,
            paddingLeft: 1.25,
          })}
        >
          {title}
        </SidebarLink>
        {sections && sections.length > 0 ? (
          <IconButton
            onClick={async () => {
              if (asPath.startsWith(`${href}#`)) {
                await router.push(href);
              }
              setOpenedPages((prev) =>
                prev.includes(href)
                  ? prev.filter((prevHref) => prevHref !== href)
                  : [...prev, href],
              );
            }}
            sx={(theme) => ({
              padding: 0,
              marginLeft: 1,
              marginTop: 0.5,
              transition: theme.transitions.create("transform"),
              transform: `rotate(${isOpen ? "90deg" : "0deg"})`,
              "& svg": {
                color: isSelected
                  ? theme.palette.purple[600]
                  : theme.palette.gray[50],
              },
            })}
          >
            <Icon
              className="fa-chevron-right"
              sx={{
                fontSize: 14,
              }}
            />
          </IconButton>
        ) : null}
      </Box>
      {sections && sections.length > 0 ? (
        <Collapse
          in={isOpen}
          onEntered={maybeUpdateSelectedOffsetTop}
          onExited={maybeUpdateSelectedOffsetTop}
        >
          {sections.map((section) => (
            <SidebarPageSection
              depth={1}
              key={section.anchor}
              pageHref={href}
              section={section}
              maybeUpdateSelectedOffsetTop={maybeUpdateSelectedOffsetTop}
              setSelectedAnchorElement={setSelectedAnchorElement}
              openedPages={openedPages}
              setOpenedPages={setOpenedPages}
            />
          ))}
        </Collapse>
      ) : null}
    </Fragment>
  );
};

type SidebarProps = {
  pages: SiteMapPage[];
  appendices?: SiteMapPage[];
  header?: React.ReactNode;
} & BoxProps;

const getInitialOpenedPages = (params: {
  pages: SiteMapPage[];
  asPath: string;
}): string[] => {
  const { pages, asPath } = params;

  for (const page of pages) {
    const { href, sections } = page;

    if (asPath === href || asPath === `${href}#`) {
      return [href];
    } else if (sections) {
      for (const section of sections) {
        const { anchor: sectionAnchor, subSections } = section;
        const sectionHref = `${href}#${sectionAnchor}`;

        if (asPath === sectionHref) {
          return [href, sectionHref];
        } else if (subSections) {
          for (const subSection of subSections) {
            const { anchor: subSectionAnchor } = subSection;
            const subSectionHref = `${href}#${subSectionAnchor}`;

            if (asPath === subSectionHref) {
              return [href, sectionHref, subSectionHref];
            }
          }
        }
      }
    }
  }

  return [];
};

export const Sidebar: VFC<SidebarProps> = ({
  appendices,
  pages,
  header,
  ...boxProps
}) => {
  const theme = useTheme();
  const { asPath } = useRouter();

  const stickinessDetectorRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState<boolean>(false);

  // Approach inspired by: https://stackoverflow.com/questions/16302483/event-to-detect-when-positionsticky-is-triggered
  useEffect(() => {
    const cachedRef = stickinessDetectorRef.current;

    if (cachedRef) {
      const observer = new IntersectionObserver(
        ([event]) => setIsSticky(event.intersectionRatio < 1),
        { threshold: [1] },
      );

      observer.observe(cachedRef);

      return () => {
        observer.unobserve(cachedRef);
      };
    }
  }, []);

  const [selectedAnchorElement, setSelectedAnchorElement] =
    useState<HTMLAnchorElement>();
  const [selectedOffsetTop, setSelectedOffsetTop] = useState<number>();
  const [openedPages, setOpenedPages] = useState<string[]>(
    getInitialOpenedPages({ pages, asPath }),
  );

  const maybeUpdateSelectedOffsetTop = useCallback(() => {
    if (
      selectedAnchorElement &&
      selectedOffsetTop !== selectedAnchorElement.offsetTop
    ) {
      setSelectedOffsetTop(selectedAnchorElement.offsetTop);
    }
  }, [selectedOffsetTop, selectedAnchorElement]);

  useEffect(() => {
    maybeUpdateSelectedOffsetTop();
  }, [maybeUpdateSelectedOffsetTop]);

  useEffect(() => {
    setOpenedPages((prev) => [
      ...prev,
      ...getInitialOpenedPages({ pages, asPath }).filter(
        (href) => !prev.includes(href),
      ),
    ]);
  }, [asPath, pages]);

  return (
    <Box
      {...boxProps}
      position="sticky"
      flexShrink={0}
      width={SIDEBAR_WIDTH}
      sx={{
        ...boxProps.sx,
        top: 0,
      }}
    >
      <Box
        ref={stickinessDetectorRef}
        sx={{
          position: "absolute",
          top: "-1px",
          height: "1px",
          width: "1px",
        }}
      />
      <Box
        sx={{
          maxHeight: isSticky ? "100vh" : undefined,
          display: "flex",
          flexDirection: "column",
          paddingTop: isSticky
            ? `${
                DESKTOP_NAVBAR_HEIGHT +
                parseIntFromPixelString(theme.spacing(1))
              }px`
            : 0,
          paddingRight: 3,
          transition: theme.transitions.create([
            "padding-top",
            "padding-bottom",
          ]),
        }}
      >
        {header}
        <Box
          position="relative"
          sx={{
            paddingRight: 3,
            marginRight: -3,
            overflow: "auto",
            paddingBottom: isSticky ? theme.spacing(6) : 0,
            flexShrink: 1,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 3,
              height: 14,
              backgroundColor: ({ palette }) => palette.purple[600],
              top: selectedOffsetTop === undefined ? 0 : selectedOffsetTop + 3,
              opacity: selectedOffsetTop === undefined ? 0 : 1,
              transition: theme.transitions.create(["top", "opacity"], {
                duration: 150,
              }),
            }}
          />
          {pages.length > 1
            ? pages.map((page) => (
                <SidebarPage
                  key={page.href}
                  page={page}
                  maybeUpdateSelectedOffsetTop={maybeUpdateSelectedOffsetTop}
                  setSelectedAnchorElement={setSelectedAnchorElement}
                  openedPages={openedPages}
                  setOpenedPages={setOpenedPages}
                />
              ))
            : pages.length === 1
            ? pages[0].sections.map((section, i) => (
                <SidebarPageSection
                  isSelectedByDefault={i === 0}
                  key={section.anchor}
                  pageHref={pages[0].href}
                  section={section}
                  maybeUpdateSelectedOffsetTop={maybeUpdateSelectedOffsetTop}
                  setSelectedAnchorElement={setSelectedAnchorElement}
                  openedPages={openedPages}
                  setOpenedPages={setOpenedPages}
                />
              ))
            : null}
          {appendices && appendices.length > 0 ? (
            <>
              <Divider sx={{ marginBottom: 2 }} />
              {appendices.map((page) => (
                <SidebarPage
                  key={page.href}
                  page={page}
                  maybeUpdateSelectedOffsetTop={maybeUpdateSelectedOffsetTop}
                  setSelectedAnchorElement={setSelectedAnchorElement}
                  openedPages={openedPages}
                  setOpenedPages={setOpenedPages}
                />
              ))}
            </>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};
