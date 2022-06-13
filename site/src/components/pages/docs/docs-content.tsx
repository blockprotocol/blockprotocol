import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { ReactNode, VFC } from "react";

import { SiteMapPage } from "../../../lib/sitemap";
import { parseIntFromPixelString } from "../../../util/mui-utils";
import {
  MDX_TEXT_CONTENT_MAX_WIDTH,
  MdxPageContent,
} from "../../mdx-page-content";
import { PageNavLinks } from "../../page-nav-links";
import { Sidebar, SIDEBAR_WIDTH } from "../../page-sidebar";
import Search from "./search";

type DocsPageProps = {
  title: ReactNode;
  subtitle: ReactNode;
  hero?: ReactNode;
  content: MDXRemoteSerializeResult<Record<string, unknown>>;
  pages: SiteMapPage[];
  appendices?: SiteMapPage[];
  currentPage?: SiteMapPage | undefined;
};

export const DocsContent: VFC<DocsPageProps> = ({
  title,
  subtitle,
  hero,
  content,
  pages,
  currentPage,
  appendices,
}) => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));

  const allPages = [...pages, ...(appendices ?? [])];

  const currentPageIndex = currentPage ? allPages.indexOf(currentPage) : -1;

  const prevPage =
    currentPageIndex > 0 ? allPages[currentPageIndex - 1] : undefined;
  const nextPage =
    currentPageIndex < allPages.length - 1
      ? allPages[currentPageIndex + 1]
      : undefined;

  const hasMultiplePages = allPages.length > 0;

  return (
    <Container
      sx={{
        marginTop: {
          xs: 6,
          md: 8,
        },
      }}
    >
      <Typography
        variant="bpTitle"
        sx={{
          marginBottom: 2,
        }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          variant="bpSubtitle"
          maxWidth={750}
          sx={{
            marginBottom: {
              xs: 6,
              md: 8,
            },
          }}
        >
          {subtitle}
        </Typography>
      ) : null}
      {hero}
      <Box mb={hasMultiplePages ? 4 : 0} display="flex" alignItems="flex-start">
        {md ? (
          <Sidebar
            flexGrow={0}
            marginRight={6}
            pages={pages}
            appendices={appendices}
            header={<Search variant="desktop" />}
          />
        ) : null}
        <MdxPageContent flexGrow={1} serializedPage={content} />
      </Box>
      {hasMultiplePages ? (
        <PageNavLinks
          prevPage={prevPage}
          nextPage={nextPage}
          sx={{
            marginLeft: {
              xs: 0,
              md: `${
                SIDEBAR_WIDTH + parseIntFromPixelString(theme.spacing(6))
              }px`,
            },
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
  );
};
