import {
  Box,
  Container,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import siteMap from "../../../site-map.json";
import { DocsContent } from "../../components/pages/docs/docs-content";
import { SiteMap, SiteMapPage } from "../../lib/sitemap";
import { getSerializedPage } from "../../util/mdx-utils";

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
  "docs-slug"?: string[];
};

type DocsPageProps = {
  tabPage: SiteMapPage;
  tabPageSerializedContent: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const getStaticPaths: GetStaticPaths<DocsPageQueryParams> = async () => {
  const possibleHrefs = documentationPages.map(({ href }) => href);

  const paths = possibleHrefs.map((href) => ({
    params: {
      "docs-slug": href
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
  const { "docs-slug": docsSlug } = params || {};

  const tabSlug = docsSlug && docsSlug.length > 0 ? docsSlug[0] : undefined;

  const tabHref = `/docs${tabSlug ? `/${tabSlug}` : ""}`;

  const tabPage = documentationPages.find(({ href }) => href === tabHref)!;

  // As of Jan 2022, { fallback: false } in getStaticPaths does not prevent Vercel
  // from calling getStaticProps for unknown pages. This causes 500 instead of 404:
  //
  //   Error: ENOENT: no such file or directory, open '{...}/_pages/docs/undefined'
  //
  // Using try / catch prevents 500, but we might not need them in Next v12+.
  try {
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
  } catch {
    return {
      notFound: true,
    };
  }
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
      <DocsContent
        title={title}
        subtitle={DOCS_PAGE_SUBTITLES[title]}
        content={tabPageSerializedContent}
        pages={[tabPage]}
      />
    </>
  );
};

export default DocsPage;
