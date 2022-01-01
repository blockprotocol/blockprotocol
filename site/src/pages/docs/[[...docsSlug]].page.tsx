import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import siteMap from "../../../site-map.json";
import { SiteMap, SiteMapPage } from "../../lib/sitemap";
import { getSerializedPage } from "../../util/mdxUtils";
import { mdxComponents } from "../../util/mdxComponents";
import { Sidebar } from "../../components/PageSidebar";

const documentationPages = (siteMap as SiteMap).pages.find(
  ({ title }) => title === "Documentation",
)!.subPages;

const DOCS_PAGE_SUBTITLES: Record<string, string> = {
  Introduction: "Getting started with the Block Protocol",
  "Developing Blocks": "A quick start guide to developing blocks",
  "Publishing Blocks": "Built a block? Share it with the world",
  "Embedding Blocks": "A guide for embedding applications",
};

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

type DocsPageQueryParams = {
  docsSlug?: string[];
};

type DocsPageProps = {
  tabPage: SiteMapPage;
  tabPageSerializedContent: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const getStaticPaths: GetStaticPaths<DocsPageQueryParams> = async () => {
  const possibleHrefs = documentationPages.map(({ href }) => href);

  const paths = possibleHrefs.map((href) => ({
    params: {
      docsSlug: href
        .replace("/docs", "")
        .split("/")
        .filter((item) => !!item),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  DocsPageProps,
  DocsPageQueryParams
> = async ({ params }) => {
  const { docsSlug } = params || {};

  const tabSlug = docsSlug && docsSlug.length > 0 ? docsSlug[0] : undefined;

  const tabHref = `/docs${tabSlug ? `/${tabSlug}` : ""}`;

  const tabPage = documentationPages.find(({ href }) => href === tabHref)!;

  const tabPageSerializedContent = await getSerializedPage({
    pathToDirectory: `docs`,
    fileNameWithoutIndex: tabSlug ?? "index",
  });

  return {
    props: {
      tabPage,
      tabPageSerializedContent,
    },
  };
};

const DocsPage: NextPage<DocsPageProps> = ({
  tabPage,
  tabPageSerializedContent,
}) => {
  const router = useRouter();
  const theme = useTheme();

  const { href, title } = tabPage;

  const md = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <Head>
        <title>Block Protocol - Documentation</title>
      </Head>
      {md && (
        <Box
          sx={{
            borderBottom: 1,
            borderColor: ({ palette }) => palette.gray[20],
            borderBottomStyle: "solid",
          }}
        >
          <Container>
            <Tabs
              value={href}
              onChange={(_, newHref) => router.push(newHref)}
              aria-label="documentation-tabs"
            >
              {documentationPages.map(
                ({ title: tabTitle, href: tabHref }, i) => (
                  <Tab
                    key={tabHref}
                    label={tabTitle}
                    value={tabHref}
                    href={tabHref}
                    component="a"
                    onClick={(
                      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
                    ) => {
                      event.preventDefault();
                    }}
                    {...a11yProps(i)}
                  />
                ),
              )}
            </Tabs>
          </Container>
        </Box>
      )}
      <Container
        sx={{
          marginTop: {
            xs: 5,
            md: 9,
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
        {DOCS_PAGE_SUBTITLES[title] ? (
          <Typography
            variant="bpSubtitle"
            maxWidth={750}
            sx={{
              marginBottom: {
                xs: 2,
                md: 3,
              },
            }}
          >
            {DOCS_PAGE_SUBTITLES[title]}
          </Typography>
        ) : null}
        <Box py={4} display="flex" alignItems="flex-start">
          {md ? <Sidebar flexGrow={0} pages={[tabPage]} /> : null}
          <Box flexGrow={1}>
            <MDXRemote
              {...tabPageSerializedContent}
              components={mdxComponents}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default DocsPage;
