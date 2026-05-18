import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { NextSeo } from "next-seo";
import { useContext } from "react";

import siteMap from "../../../site-map.json";
import { DocsContent } from "../../components/pages/docs/docs-content";
import { generatePathWithoutParams } from "../../components/shared";
import SiteMapContext from "../../context/site-map-context";
import {
  DOCS_VERSIONS,
  DocsVersion,
  isDocsVersion,
  LATEST_DOCS_VERSION,
} from "../../lib/docs-versions";
import { SiteMap, SiteMapPage } from "../../lib/sitemap";
import { getSerializedPageForVersion } from "../../util/mdx-utils";

const typedSiteMap = siteMap as SiteMap;

const docsPagesByVersion = typedSiteMap.versionedSubPages.docs;

type DocsPageQueryParams = {
  "docs-slug"?: string[];
};

type DocsPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
  requestedVersion: DocsVersion;
  servedFromVersion: DocsVersion;
};

const flattenPages = (pages: SiteMapPage[]): SiteMapPage[] =>
  pages.flatMap((page) => [page, ...flattenPages(page.subPages ?? [])]);

export const getStaticPaths: GetStaticPaths<
  DocsPageQueryParams
> = async () => {
  const paths = DOCS_VERSIONS.flatMap((version) => {
    const versionPages = docsPagesByVersion[version] ?? [];
    const allHrefs = flattenPages(versionPages).map(({ href }) => href);
    // Ensure the bare `/docs/<version>` index is always emitted, even if the
    // index page is itself only available via fallback.
    const hrefSet = new Set(allHrefs);
    hrefSet.add(`/docs/${version}`);

    return Array.from(hrefSet).map((href) => ({
      params: {
        "docs-slug": href
          .replace(/^\/docs\//, "")
          .split("/")
          .filter((item) => !!item),
      },
    }));
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  DocsPageProps,
  DocsPageQueryParams
> = async ({ params }) => {
  const docsSlug = (params || {})["docs-slug"] ?? [];

  const [maybeVersion, ...slugRest] = docsSlug;

  if (!maybeVersion || !isDocsVersion(maybeVersion)) {
    // Requests without a version segment shouldn't reach this handler in
    // production (middleware redirects them), but if one slips through (e.g.
    // because the middleware was bypassed by a stale build), 404 cleanly.
    return { notFound: true };
  }

  try {
    const { serializedPage, servedFromVersion } =
      await getSerializedPageForVersion({
        section: "docs",
        requestedVersion: maybeVersion,
        parts: slugRest.length ? slugRest : ["index"],
      });

    return {
      props: {
        serializedPage,
        requestedVersion: maybeVersion,
        servedFromVersion,
      },
    };
  } catch {
    return { notFound: true };
  }
};

const DocsPage: NextPage<DocsPageProps> = ({
  serializedPage,
  requestedVersion,
}) => {
  const { asPath } = useRouter();
  const { pages: allPages, versionedSubPages } = useContext(SiteMapContext);

  const pathWithoutParams = generatePathWithoutParams(asPath);

  const docsForVersion =
    versionedSubPages?.docs[requestedVersion] ??
    versionedSubPages?.docs[LATEST_DOCS_VERSION] ??
    [];

  const specForVersion =
    versionedSubPages?.spec[requestedVersion] ??
    versionedSubPages?.spec[LATEST_DOCS_VERSION] ??
    [];

  const roadmapPage = allPages
    .find(({ title }) => title === "Docs")
    ?.subPages?.find(({ title }) => title === "Roadmap");

  const subPages = [
    ...docsForVersion,
    ...specForVersion,
    ...(roadmapPage ? [roadmapPage] : []),
  ];

  const flatSubPages = subPages.flatMap((page) => [
    page,
    ...(page.subPages ?? []),
  ]);

  const currentPage = flatSubPages.find(
    ({ href }) =>
      pathWithoutParams === href || pathWithoutParams?.startsWith(`${href}#`),
  );

  return (
    <>
      <NextSeo title="Block Protocol – Docs" />
      <DocsContent
        content={serializedPage}
        pages={subPages}
        flatPages={flatSubPages}
        currentPage={currentPage}
      />
    </>
  );
};

export default DocsPage;
