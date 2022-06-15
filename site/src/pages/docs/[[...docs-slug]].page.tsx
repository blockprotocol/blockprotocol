import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { useContext } from "react";

import siteMap from "../../../site-map.json";
import { DocsContent } from "../../components/pages/docs/docs-content";
import SiteMapContext from "../../context/site-map-context";
import { SiteMap } from "../../lib/sitemap";
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

type DocsPageQueryParams = {
  "docs-slug"?: string[];
};

type DocsPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
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
  const docsSlug = (params || {})["docs-slug"];

  const fileNameWithoutIndex =
    docsSlug && docsSlug.length > 0 ? docsSlug[0]! : "index";

  // As of Jan 2022, { fallback: false } in getStaticPaths does not prevent Vercel
  // from calling getStaticProps for unknown pages. This causes 500 instead of 404:
  //
  //   Error: ENOENT: no such file or directory, open '{...}/_pages/docs/undefined'
  //
  // Using try / catch prevents 500, but we might not need them in Next v12+.
  try {
    const serializedPage = await getSerializedPage({
      pathToDirectory: "docs",
      fileNameWithoutIndex,
    });

    return {
      props: {
        serializedPage,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

const DocsPage: NextPage<DocsPageProps> = ({ serializedPage }) => {
  const { asPath } = useRouter();
  const { pages: allPages } = useContext(SiteMapContext);

  const { subPages: specificationPages } = allPages.find(
    ({ title }) => title === "Documentation",
  )!;

  const currentPage = specificationPages.find(
    ({ href }) => asPath === href || asPath.startsWith(`${href}#`),
  );

  const { title } = currentPage!;

  return (
    <>
      <Head>
        <title>Block Protocol - Documentation</title>
      </Head>
      <DocsContent
        title={title}
        subtitle={DOCS_PAGE_SUBTITLES[title]}
        content={serializedPage}
        pages={specificationPages}
        currentPage={currentPage}
      />
    </>
  );
};

export default DocsPage;
