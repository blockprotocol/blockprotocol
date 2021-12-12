/* eslint-disable no-restricted-syntax */
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
import { Link } from "./Link";

const SidebarLink = styled(Link)(({ theme }) => ({
  display: "block",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: theme.transitions.create(["color"]),
  color: theme.palette.gray[70],
  ":hover": {
    color: theme.palette.purple[500],
  },
  fontWeight: 400,
  fontSize: 15,
}));

type SidebarPageSubSection = {
  title: string;
  anchor: string;
};

type SidebarPageSection = {
  title: string;
  anchor: string;
  subSections?: SidebarPageSubSection[];
};

type SidebarPage = {
  title: string;
  href: string;
  sections?: SidebarPageSection[];
};

type SidebarPagePagesProps = {
  page: SidebarPage;
  maybeUpdateSelectedOffsetTop: () => void;
  setSelectedAnchorElement: (element: HTMLAnchorElement) => void;
  openedPages: string[];
  setOpenedPages: Dispatch<SetStateAction<string[]>>;
};

const SidebarPagePages: VFC<SidebarPagePagesProps> = ({
  page,
  maybeUpdateSelectedOffsetTop,
  setSelectedAnchorElement,
  openedPages,
  setOpenedPages,
}) => {
  const router = useRouter();
  const { asPath } = router;

  const { href, title, sections } = page;

  const isSelected = asPath === href;
  const isOpen = openedPages.includes(href);

  return (
    <Fragment key={href}>
      <Box mb={1} display="flex" alignItems="center">
        <SidebarLink
          ref={(ref) => {
            if (ref && isSelected) {
              setSelectedAnchorElement(ref);
            }
          }}
          href={href}
          sx={(theme) => ({
            alignSelf: "flex-start",
            color: isSelected
              ? theme.palette.purple[500]
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
              if (asPath.startsWith(`${href}#`) && asPath !== href) {
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
              transition: theme.transitions.create("transform"),
              transform: `rotate(${isOpen ? "90deg" : "0deg"})`,
              "& svg": {
                color: isSelected
                  ? theme.palette.purple[500]
                  : theme.palette.gray[50],
              },
            })}
          >
            <Icon
              className="fa-chevron-right"
              sx={{
                fontSize: 14,
              }}
              fontSize="inherit"
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
          {sections.map(
            ({ anchor: sectionAnchor, title: sectionTitle, subSections }) => {
              const sectionHref = `${href}#${sectionAnchor}`;

              const isSectionSelected = asPath === sectionHref;
              const hasSelectedSubSection =
                subSections &&
                subSections.find(
                  ({ anchor: subSectionAnchor }) =>
                    asPath === `${href}#${subSectionAnchor}`,
                ) !== undefined;
              const isSectionOpen = openedPages.includes(sectionHref);

              return (
                <Fragment key={sectionAnchor}>
                  <Box mb={1} display="flex" alignItems="center">
                    <SidebarLink
                      ref={(ref) => {
                        if (ref && isSectionSelected) {
                          setSelectedAnchorElement(ref);
                        }
                      }}
                      href={sectionHref}
                      sx={(theme) => ({
                        paddingLeft: 3.25,
                        color: isSectionSelected
                          ? theme.palette.purple[500]
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
                              ? prev.filter(
                                  (prevHref) => prevHref !== sectionHref,
                                )
                              : [...prev, sectionHref],
                          );
                        }}
                        sx={(theme) => ({
                          padding: 0,
                          marginLeft: 1,
                          transition: theme.transitions.create("transform"),
                          transform: `rotate(${
                            isSectionOpen ? "90deg" : "0deg"
                          })`,
                          "& svg": {
                            color: isSectionSelected
                              ? theme.palette.purple[500]
                              : theme.palette.gray[50],
                          },
                        })}
                      >
                        <Icon
                          className="fa-chevron-right"
                          sx={{
                            fontSize: 14,
                          }}
                          fontSize="inherit"
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
                      {subSections.map(
                        ({
                          title: subSectionTitle,
                          anchor: subSectionAnchor,
                        }) => {
                          const isSubSectionSelected = asPath.endsWith(
                            `#${subSectionAnchor}`,
                          );
                          return (
                            <SidebarLink
                              key={subSectionAnchor}
                              ref={(ref) => {
                                if (ref && isSubSectionSelected) {
                                  setSelectedAnchorElement(ref);
                                }
                              }}
                              href={`${href}#${subSectionAnchor}`}
                              sx={(theme) => ({
                                marginBottom: 1,
                                paddingLeft: 4.25,
                                color: isSubSectionSelected
                                  ? theme.palette.purple[500]
                                  : theme.palette.gray[70],
                                fontWeight: isSubSectionSelected ? 700 : 400,
                              })}
                            >
                              {subSectionTitle}
                            </SidebarLink>
                          );
                        },
                      )}
                    </Collapse>
                  ) : null}
                </Fragment>
              );
            },
          )}
        </Collapse>
      ) : null}
    </Fragment>
  );
};

type SidebarProps = {
  pages: SidebarPage[];
  appendices?: SidebarPage[];
};

const getInitialOpenedPages = (params: {
  pages: SidebarPage[];
  asPath: string;
}): string[] => {
  const { pages, asPath } = params;

  for (const page of pages) {
    const { href, sections } = page;

    if (asPath === href) {
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
          backgroundColor: ({ palette }) => palette.purple[500],
          top: selectedOffsetTop === undefined ? 0 : selectedOffsetTop + 4,
          opacity: selectedOffsetTop === undefined ? 0 : 1,
          transition: theme.transitions.create(["top", "opacity"], {
            duration: 150,
          }),
        })}
      />
      {pages.map((page) => (
        <SidebarPagePages
          key={page.href}
          page={page}
          maybeUpdateSelectedOffsetTop={maybeUpdateSelectedOffsetTop}
          setSelectedAnchorElement={setSelectedAnchorElement}
          openedPages={openedPages}
          setOpenedPages={setOpenedPages}
        />
      ))}
      {appendices && appendices.length > 0 ? (
        <>
          <Divider />
          {appendices.map((page) => (
            <SidebarPagePages
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
