import {
  Collapse,
  Box,
  Icon,
  IconButton,
  Divider,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  VFC,
} from "react";
import { SiteMapPage, SiteMapPageSection } from "../lib/sitemap";
import { Link } from "./Link";

const SidebarLink = styled(Link)(({ theme }) => ({
  display: "block",
  lineHeight: "1.25em",
  transition: theme.transitions.create(["color"]),
  color: theme.palette.gray[70],
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

  const sectionHref = `${pageHref}#${sectionAnchor}`;

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
              : theme.palette.gray[70],
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
          onClick={() => {
            if (asPath.startsWith(`${href}#`)) {
              window.scrollTo({ top: 0 });
            }
          }}
          href={href}
          sx={(theme) => ({
            alignSelf: "flex-start",
            color: isSelected
              ? theme.palette.purple[600]
              : theme.palette.gray[70],
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
};

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

export const Sidebar: VFC<SidebarProps> = ({ appendices, pages }) => {
  const { asPath } = useRouter();

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
    <Box position="relative">
      <Box
        sx={(theme) => ({
          position: "absolute",
          width: 3,
          height: 14,
          backgroundColor: ({ palette }) => palette.purple[600],
          top: selectedOffsetTop === undefined ? 0 : selectedOffsetTop + 4,
          opacity: selectedOffsetTop === undefined ? 0 : 1,
          transition: theme.transitions.create(["top", "opacity"], {
            duration: 150,
          }),
        })}
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
  );
};
