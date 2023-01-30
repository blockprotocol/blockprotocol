import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Breadcrumbs,
  Collapse,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { FunctionComponent, ReactNode } from "react";

import { SiteMapPage } from "../../../lib/sitemap";
import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";
import {
  MDX_TEXT_CONTENT_MAX_WIDTH,
  MdxPageContent,
} from "../../mdx/mdx-page-content";
import { PageNavLinks } from "../../page-nav-links";
import { Sidebar } from "../../page-sidebar";

type DocsPageProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  content: MDXRemoteSerializeResult<Record<string, unknown>>;
  pages: SiteMapPage[];
  flatPages?: SiteMapPage[];
  appendices?: SiteMapPage[];
  currentPage?: SiteMapPage | undefined;
};

const getParentPages = (
  pages: SiteMapPage[],
  currentPage: SiteMapPage,
): SiteMapPage[] | null => {
  for (const page of pages) {
    if (page.href === currentPage.href) {
      return [];
    }
    const subParents = getParentPages(page.subPages ?? [], currentPage);
    if (subParents) {
      return [page, ...subParents];
    }
  }
  return null;
};

export const DocsContent: FunctionComponent<DocsPageProps> = ({
  title,
  subtitle,
  content,
  pages,
  flatPages = pages,
  currentPage,
  appendices,
}) => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));

  const allPages = [...flatPages, ...(appendices ?? [])];

  const currentPageIndex = currentPage ? allPages.indexOf(currentPage) : -1;

  const prevPage =
    currentPageIndex > 0 ? allPages[currentPageIndex - 1] : undefined;
  const nextPage =
    currentPageIndex < allPages.length - 1
      ? allPages[currentPageIndex + 1]
      : undefined;

  const hasMultiplePages = allPages.length > 0;

  const parents = currentPage ? getParentPages(pages, currentPage) : null;

  return (
    <Box display="flex" alignItems="flex-start">
      {md ? (
        <Sidebar
          flexGrow={0}
          marginRight="62px"
          pages={pages}
          appendices={appendices}
        />
      ) : null}
      <Container
        sx={{
          margin: 0,
          marginTop: { xs: 5, md: 8 },
          width: "inherit",
          maxWidth: "100%",
        }}
      >
        {title ? (
          <Typography
            variant="bpTitle"
            sx={{
              marginBottom: 2,
            }}
          >
            {title}
          </Typography>
        ) : null}
        {subtitle ? (
          <Typography
            variant="bpSubtitle"
            maxWidth={750}
            sx={{
              marginBottom: 6,
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
        {parents ? (
          <Collapse in={md && !!parents && parents.length > 0}>
            <Breadcrumbs
              separator={
                <FontAwesomeIcon
                  sx={{
                    fontSize: 14,
                    color: ({ palette }) => palette.gray[40],
                  }}
                  icon={faChevronRight}
                />
              }
              sx={{ marginBottom: 2, marginLeft: 0.25 }}
            >
              {parents.map(({ href, title: parentTitle }, i, all) => (
                <Link
                  key={href}
                  href={href}
                  sx={{
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {parentTitle}
                  {i === all.length - 1 ? (
                    <FontAwesomeIcon
                      sx={{
                        fontSize: 14,
                        color: ({ palette }) => palette.gray[40],
                        marginLeft: 1,
                      }}
                      icon={faChevronRight}
                    />
                  ) : null}
                </Link>
              ))}
            </Breadcrumbs>
          </Collapse>
        ) : null}

        <Box mb={hasMultiplePages ? 4 : 0}>
          <MdxPageContent flexGrow={1} serializedPage={content} />
        </Box>
        {hasMultiplePages ? (
          <PageNavLinks
            prevPage={prevPage}
            nextPage={nextPage}
            sx={{
              maxWidth: {
                sx: "100%",
                sm: MDX_TEXT_CONTENT_MAX_WIDTH,
              },
              marginBottom: {
                xs: 8,
                md: 14,
              },
            }}
          />
        ) : null}
      </Container>
    </Box>
  );
};
