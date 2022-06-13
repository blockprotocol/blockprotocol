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
import { MdxPageContent } from "../../mdx-page-content";
import { Sidebar } from "../../page-sidebar";
import Search from "./search";

type DocsPageProps = {
  title: ReactNode;
  subtitle: ReactNode;
  hero?: ReactNode;
  content: MDXRemoteSerializeResult<Record<string, unknown>>;
  footer?: ReactNode;
  pages: SiteMapPage[];
  appendices?: SiteMapPage[];
};

export const DocsContent: VFC<DocsPageProps> = ({
  title,
  subtitle,
  hero,
  content,
  footer,
  pages,
  appendices,
}) => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));

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
      <Box mb={footer ? 4 : 0} display="flex" alignItems="flex-start">
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
      {footer}
    </Container>
  );
};
