import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Breadcrumbs,
  Collapse,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { FunctionComponent } from "react";

import { SiteMapPage } from "../../../lib/sitemap";
import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";
import { MdxPageContent } from "../../mdx/mdx-page-content";

type LegalPageProps = {
  content: MDXRemoteSerializeResult<Record<string, unknown>>;
  pages: SiteMapPage[];
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

export const LegalContent: FunctionComponent<LegalPageProps> = ({
  content,
  pages,
  currentPage,
}) => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));

  const parents = currentPage ? getParentPages(pages, currentPage) : null;

  // No sidebar exists for these pages currently
  // No "prev" "next" page buttons
  return (
    <Box display="flex" alignItems="flex-start">
      <Container
        sx={{
          margin: "auto",
          marginTop: { xs: 5, md: 8 },
          width: "inherit",
          maxWidth: "100%",
        }}
      >
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

        <Box mb={4}>
          <MdxPageContent flexGrow={1} serializedPage={content} />
        </Box>
      </Container>
    </Box>
  );
};
