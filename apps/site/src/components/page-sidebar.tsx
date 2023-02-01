import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  BoxProps,
  Collapse,
  Divider,
  IconButton,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  Dispatch,
  Fragment,
  FunctionComponent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { SiteMapPage, SiteMapPageSection } from "../lib/sitemap";
import { theme as themeImport } from "../theme";
import { parseHTML } from "../util/html-utils";
import { FontAwesomeIcon } from "./icons";
import { Link } from "./link";
import { DESKTOP_NAVBAR_HEIGHT, MOBILE_NAVBAR_HEIGHT } from "./navbar";
import { generatePathWithoutParams } from "./shared";

export const SIDEBAR_WIDTH = 300;

const SidebarLink = styled(Link)(({ theme }) => ({
  display: "block",
  lineHeight: "1.25em",
  transition: theme.transitions.create(["color"]),
  color: theme.palette.gray[80],
  ":hover": {
    color: theme.palette.purple[600],
  },
  fontWeight: 500,
  fontSize: 15,
  paddingTop: 8,
  paddingBottom: 8,
  wordBreak: "break-word",
}));

type SidebarPageSectionProps = {
  depth?: number;
  isSelectedByDefault?: boolean;
  pageHref: string;
  section: SiteMapPageSection;
  setSelectedAnchorElement: (element: HTMLAnchorElement) => void;
  openedPages: string[];
  setOpenedPages: Dispatch<SetStateAction<string[]>>;
};

const highlightSection = (isSectionSelected: boolean) => ({
  borderLeft: `3px solid ${
    isSectionSelected ? themeImport.palette.purple[700] : "transparent"
  }`,
});

const SidebarPageSection: FunctionComponent<SidebarPageSectionProps> = ({
  depth = 1,
  isSelectedByDefault = false,
  pageHref,
  section,
  setSelectedAnchorElement,
  openedPages,
  setOpenedPages,
}) => {
  const router = useRouter();
  const { asPath } = router;
  const pathWithoutParams = generatePathWithoutParams(asPath);

  const { title: sectionTitle, anchor: sectionAnchor, subSections } = section;

  const sectionHref = sectionAnchor ? `${pageHref}#${sectionAnchor}` : pageHref;

  const isSectionSelected =
    pathWithoutParams === sectionHref ||
    (isSelectedByDefault &&
      (pathWithoutParams === pageHref || pathWithoutParams === `${pageHref}#`));
  const hasSelectedSubSection =
    subSections?.find(
      ({ anchor: subSectionAnchor }) =>
        pathWithoutParams === `${pageHref}#${subSectionAnchor}`,
    ) !== undefined;
  const isSectionOpen = openedPages.includes(sectionHref);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        visibility="inherit"
        bgcolor={
          isSectionSelected
            ? (theme) => theme.palette.purple[100]
            : "transparent"
        }
        pr={1}
      >
        <SidebarLink
          replace
          ref={(ref) => {
            if (ref && isSectionSelected) {
              setSelectedAnchorElement(ref);
            }
          }}
          href={sectionHref}
          sx={(theme) => ({
            paddingLeft: depth * 2 + 1.25,
            color: isSectionSelected
              ? theme.palette.purple[700]
              : theme.palette.gray[80],
            ...highlightSection(isSectionSelected),
          })}
        >
          {parseHTML(sectionTitle)}
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
              transition: theme.transitions.create("transform"),
              transform: `rotate(${isSectionOpen ? "90deg" : "0deg"})`,
              "& svg": {
                color: isSectionSelected
                  ? theme.palette.purple[700]
                  : theme.palette.gray[50],
              },
            })}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              sx={{
                fontSize: 14,
              }}
            />
          </IconButton>
        ) : null}
      </Box>
      {subSections && subSections.length > 0 ? (
        <Collapse in={isSectionOpen}>
          {subSections.map((subSection) => (
            <SidebarPageSection
              depth={depth + 1}
              key={subSection.anchor}
              pageHref={pageHref}
              section={subSection}
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
  depth?: number;
  page: SiteMapPage;
  setSelectedAnchorElement: (element: HTMLAnchorElement) => void;
  openedPages: string[];
  setOpenedPages: Dispatch<SetStateAction<string[]>>;
};

const SidebarPage: FunctionComponent<SidebarPageProps> = ({
  depth = 0,
  page,
  setSelectedAnchorElement,
  openedPages,
  setOpenedPages,
}) => {
  const router = useRouter();
  const { asPath } = router;
  const pathWithoutParams = generatePathWithoutParams(asPath);

  const { href, title, sections = [], subPages = [] } = page;

  const isSelected =
    pathWithoutParams === href || pathWithoutParams === `${href}#`;

  const isOpen = openedPages.includes(href);
  const hasChildren = (sections?.length ?? 0) + (subPages?.length ?? 0) > 0;

  return (
    <Fragment key={href}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor={
          isSelected ? (theme) => theme.palette.purple[100] : "transparent"
        }
        pr={1}
      >
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
              ? theme.palette.purple[800]
              : theme.palette.gray[80],
            paddingLeft: depth * 2 + 1.25,
            ...highlightSection(isSelected),
          })}
        >
          {title}
        </SidebarLink>
        {hasChildren ? (
          <IconButton
            onClick={async () => {
              if (asPath.startsWith(`${href}#`)) {
                await router.push(href);
              }
              setOpenedPages((prev) =>
                prev.includes(href)
                  ? prev.filter((prevHref) => prevHref !== href)
                  : depth === 0
                  ? [href]
                  : [...prev, href],
              );
            }}
            sx={(theme) => ({
              padding: 0,
              marginLeft: 1,
              transition: theme.transitions.create("transform"),
              transform: `rotate(${isOpen ? "90deg" : "0deg"})`,
              "& svg": {
                color: isSelected
                  ? theme.palette.purple[800]
                  : theme.palette.gray[50],
              },
            })}
          >
            <FontAwesomeIcon icon={faChevronRight} sx={{ fontSize: 14 }} />
          </IconButton>
        ) : null}
      </Box>
      {hasChildren ? (
        <Collapse in={isOpen}>
          {sections.map((section) => (
            <SidebarPageSection
              depth={depth + 1}
              key={section.anchor}
              pageHref={href}
              section={section}
              setSelectedAnchorElement={setSelectedAnchorElement}
              openedPages={openedPages}
              setOpenedPages={setOpenedPages}
            />
          ))}
          {subPages.map((subpage) => (
            <SidebarPage
              key={subpage.href}
              depth={depth + 1}
              page={subpage}
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
} & BoxProps;

const findSectionPath = (
  href: string,
  sections: SiteMapPageSection[],
  pathWithoutParams: string,
): string[] | null => {
  for (const section of sections) {
    const sectionHref = `${href}#${section.anchor}`;

    if (pathWithoutParams === sectionHref) {
      return [sectionHref];
    }

    if (section.subSections) {
      const result = findSectionPath(
        href,
        section.subSections,
        pathWithoutParams,
      );

      if (result) {
        return [sectionHref, ...result];
      }
    }
  }

  return null;
};

const getInitialOpenedPages = (params: {
  pages: SiteMapPage[];
  asPath: string;
}): string[] => {
  const { pages, asPath } = params;
  const pathWithoutParams = generatePathWithoutParams(asPath);

  for (const page of pages) {
    const { href, sections, subPages } = page;
    if (pathWithoutParams === href || pathWithoutParams === `${href}#`) {
      return [href];
    }
    const sectionPath = findSectionPath(
      href,
      sections ?? [],
      pathWithoutParams,
    );

    if (sectionPath) {
      return [href, ...sectionPath];
    }

    const openSubPages = getInitialOpenedPages({
      pages: subPages ?? [],
      asPath: pathWithoutParams,
    });

    if (openSubPages.length > 0) {
      return [href, ...openSubPages];
    }
  }
  return [];
};

export const Sidebar: FunctionComponent<SidebarProps> = ({
  appendices,
  pages,
  sx = [],
  ...boxProps
}) => {
  const theme = useTheme();
  const { asPath } = useRouter();

  const md = useMediaQuery(theme.breakpoints.up("md"));

  const [openedPages, setOpenedPages] = useState<string[]>(
    getInitialOpenedPages({ pages, asPath }),
  );

  const setSelectedAnchorElementTimeout = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const setSelectedAnchorElement = useCallback((node: HTMLAnchorElement) => {
    if (setSelectedAnchorElementTimeout.current) {
      clearTimeout(setSelectedAnchorElementTimeout.current);
    }

    setSelectedAnchorElementTimeout.current = setTimeout(() => {
      const parent = node.offsetParent as HTMLElement;
      const min = parent.scrollTop;
      const max = min + parent.offsetHeight - 100;
      const pos = node.offsetTop;

      if (pos <= min || pos >= max) {
        parent!.scrollTop += pos - max;
      }
    }, 100);
  }, []);

  useEffect(() => {
    return () => {
      if (setSelectedAnchorElementTimeout.current) {
        clearTimeout(setSelectedAnchorElementTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    setOpenedPages((prev) => [
      ...prev,
      ...getInitialOpenedPages({ pages, asPath }).filter(
        (href) => !prev.includes(href),
      ),
    ]);
  }, [asPath, pages]);

  const height = md ? DESKTOP_NAVBAR_HEIGHT : MOBILE_NAVBAR_HEIGHT;

  return (
    <Box
      {...boxProps}
      component="aside"
      position="sticky"
      overflow="auto"
      width={SIDEBAR_WIDTH}
      top={`${height}px`}
      height={`calc(100vh - ${height}px)`}
      sx={[
        {
          borderRightColor: theme.palette.gray[30],
          borderRightStyle: "solid",
          borderRightWidth: 1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          transition: theme.transitions.create([
            "padding-top",
            "padding-bottom",
          ]),
          wordBreak: "break-word",
        }}
      >
        {pages.length > 1 ? (
          pages.map((page) => (
            <SidebarPage
              key={page.href}
              page={page}
              setSelectedAnchorElement={setSelectedAnchorElement}
              openedPages={openedPages}
              setOpenedPages={setOpenedPages}
            />
          ))
        ) : pages.length === 1 ? (
          <>
            {/* When the sidebar is only displaying one page, we can display its sub-sections and sub-pages directly */}
            {pages[0]!.sections?.map((section, i) => (
              <SidebarPageSection
                key={section.anchor}
                isSelectedByDefault={i === 0}
                depth={0}
                pageHref={pages[0]!.href}
                section={section}
                setSelectedAnchorElement={setSelectedAnchorElement}
                openedPages={openedPages}
                setOpenedPages={setOpenedPages}
              />
            ))}
            {pages[0]!.subPages?.map((subpage) => (
              <SidebarPage
                key={subpage.href}
                depth={0}
                page={subpage}
                setSelectedAnchorElement={setSelectedAnchorElement}
                openedPages={openedPages}
                setOpenedPages={setOpenedPages}
              />
            ))}
          </>
        ) : null}
        {appendices && appendices.length > 0 ? (
          <>
            <Divider sx={{ marginBottom: 2 }} />
            {appendices.map((page) => (
              <SidebarPage
                key={page.href}
                page={page}
                setSelectedAnchorElement={setSelectedAnchorElement}
                openedPages={openedPages}
                setOpenedPages={setOpenedPages}
              />
            ))}
          </>
        ) : null}
      </Box>
    </Box>
  );
};
